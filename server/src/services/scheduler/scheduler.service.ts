import { Injectable, Logger } from "@nestjs/common";
import { SchedulerRegistry } from "@nestjs/schedule";
import { InjectRepository } from "@nestjs/typeorm";
import { CronJob } from "cron";
import { Repository } from "typeorm";
import { SchedulerConfigService } from "../../config/scheduler/configuration.service";
import { Neighborhood } from "../../database/entities/neighborhood.entity";
import { TransactionDetails } from "../../database/entities/transaction-details.entity";
import { Transaction } from "../../database/entities/transaction.entity";
import { BlockService } from "../../neighborhoods/blocks/block.service";
import { NeighborhoodService } from "../../neighborhoods/neighborhood.service";
import { TransactionsService } from "../../neighborhoods/transactions/transactions.service";
import { NetworkService } from "../network.service";
import { TxAnalyzerService } from "./tx-analyzer.service";

@Injectable()
export class SchedulerService {
  private readonly logger = new Logger(SchedulerService.name);
  private done = true;

  constructor(
    private schedulerConfig: SchedulerConfigService,
    private schedulerRegistry: SchedulerRegistry,
    private network: NetworkService,
    private neighborhood: NeighborhoodService,
    private block: BlockService,
    private transaction: TransactionsService,
    private txAnalyzer: TxAnalyzerService,
    @InjectRepository(TransactionDetails)
    private txDetailsRepository: Repository<TransactionDetails>,
  ) {
    const jobFn = () => this.run();

    if (schedulerConfig.cron !== undefined) {
      // Do not rerun the cron job if the previous one was done.
      const job = new CronJob(schedulerConfig.cron, jobFn);
      this.schedulerRegistry.addCronJob("updateNeighborhood", job);
      job.start();
    } else if (schedulerConfig.seconds !== undefined) {
      const id = setInterval(jobFn, schedulerConfig.seconds * 1000);
      this.schedulerRegistry.addInterval("updateNeighborhood", id);
    } else {
      this.logger.log(`Scheduler disabled.`);
    }
  }

  async run() {
    if (this.done) {
      this.done = false;
      this.logger.log("Starting new scheduler run...");
      try {
        await this.updateNeighborhoods();
      } catch (err) {
        this.logger.error(`Error during update: ${err}`);
      }
      // On error, hope for the best next time.
      this.done = true;
    }
  }

  protected async step(method: () => Promise<void>, name: string) {
    try {
      await method();
    } catch (e) {
      this.logger.error(
        `Error happened while ${name}: ${e}.\nStack: ${e.stack}`,
      );
    }
  }

  async updateNeighborhoods() {
    const neighborhoods = await this.neighborhood.findAll();

    if (neighborhoods.length > 0) {
      this.logger.debug(`Updating ${neighborhoods.length} neighborhoods.`);

      // Do all neighborhoods in parallel.
      await Promise.all(
        neighborhoods.map(async (n) => {
          await this.step(
            () => this.updateNeighborhoodEarliestMissingBlocks(n),
            "updating missing blocks",
          );
          await this.step(
            () => this.updateNeighborhoodMissingTransactionDetails(n),
            "updating transaction details",
          );
        }),
      );
    } else {
      this.logger.debug("No neighborhoods in database...");
    }
  }

  async updateNeighborhoodMissingTransactionDetails(
    neighborhood: Neighborhood,
  ) {
    const missingTxDetailsIds =
      await this.txAnalyzer.missingTransactionDetailsForNeighborhood(
        neighborhood,
      );

    const transactions: Transaction[] = await this.transaction.findManyByIds(
      neighborhood,
      missingTxDetailsIds,
    );

    for (const tx of transactions) {
      const details = await this.txAnalyzer.analyzeTransaction(tx);
      await this.txDetailsRepository.save(details);
    }
  }

  async updateNeighborhoodEarliestMissingBlocks(neighborhood: Neighborhood) {
    const network = await this.network.forUrl(neighborhood.url);
    const latestHeight = await this.block.getLatestHeightOf(neighborhood);
    const missingBlocks = await this.block.missingBlockHeightsForNeighborhood(
      neighborhood,
      latestHeight,
      this.schedulerConfig.maxBlocks,
    );

    if (missingBlocks.length == 0) {
      // Nothing to do, save some math.
      return;
    }

    // Split missing blocks into groups of parallel.
    const parallel = this.schedulerConfig.parallel;
    const parallelSleep = this.schedulerConfig.parallelSleep;
    const schedule = [];
    for (let i = 0; i < missingBlocks.length; i += parallel) {
      schedule[schedule.length] = missingBlocks.slice(i, i + parallel);
    }

    for (const batch of schedule) {
      await Promise.all(
        batch.map(async (height) => {
          const blockInfo = await network.blockchain.blockByHeight(height);
          await this.block.createFromManyBlock(neighborhood, blockInfo);
        }),
      );

      // Sleep a bit.
      await new Promise((res) => setTimeout(res, parallelSleep * 1000));
    }
    this.logger.log(
      `Neighborhood ${neighborhood.id}: done ${missingBlocks.length} blocks ${
        missingBlocks[0]
      }..=${missingBlocks[missingBlocks.length - 1]}`,
    );
  }
}
