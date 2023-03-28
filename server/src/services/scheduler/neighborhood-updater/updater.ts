import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { SchedulerConfigService } from "../../../config/scheduler/configuration.service";
import { Neighborhood } from "../../../database/entities/neighborhood.entity";
import { TransactionDetails } from "../../../database/entities/transaction-details.entity";
import { Transaction } from "../../../database/entities/transaction.entity";
import { BlockService } from "../../../neighborhoods/blocks/block.service";
import { NeighborhoodService } from "../../../neighborhoods/neighborhood.service";
import { TransactionsService } from "../../../neighborhoods/transactions/transactions.service";
import { NetworkService } from "../../network.service";
import { TxAnalyzerService } from "../tx-analyzer.service";

@Injectable()
export class NeighborhoodUpdater {
  private logger: Logger;
  private n: Neighborhood;

  constructor(
    private schedulerConfig: SchedulerConfigService,
    private network: NetworkService,
    private neighborhood: NeighborhoodService,
    private block: BlockService,
    private transaction: TransactionsService,
    private txAnalyzer: TxAnalyzerService,
    @InjectRepository(TransactionDetails)
    private txDetailsRepository: Repository<TransactionDetails>,
  ) {}

  with(n: Neighborhood) {
    this.n = n;
    this.logger = new Logger(`${NeighborhoodUpdater.name}(${n.id})`);
    return this;
  }

  private async step(method: () => Promise<void>, nid: number, name: string) {
    try {
      await method();
    } catch (e) {
      this.logger.error(
        `Error happened while ${name} in neighborhood ${nid}: ${e}.\nStack: ${e.stack}`,
      );
    }
  }

  private async updateNeighborhoodMissingTransactionDetails(
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
      if (details) {
        await this.txDetailsRepository.save(details);
      }
    }
  }

  private async checkIfNeighborhoodHasBeenReset(neighborhood: Neighborhood) {
    const genesisHash = await this.block.getGenesisBlockHash(neighborhood);
    if (!genesisHash) {
      this.logger.warn("No genesis block from neighborhood. Will not remove.");
      return;
    }

    const block = await this.block.findOneByHeight(neighborhood.id, 1);
    if (!block || !block.hash) {
      return;
    }

    if (Buffer.from(genesisHash).compare(Buffer.from(block.hash)) == 0) {
      return;
    }

    this.logger.log("Neighborhood seems reset (genesis not same hash).");
    // Here, we're talking about different networks for sure. Recreate it
    // and the rest of the scheduler should take care of re-catching up.
    const n = await this.neighborhood.get(neighborhood.id);
    await this.neighborhood.resetNeighborhood(neighborhood.id, n);
  }

  private async updateNeighborhoodEarliestMissingBlocks(
    neighborhood: Neighborhood,
  ) {
    const network = await this.network.forUrl(neighborhood.url);
    const latestHeight = await this.block.getLatestHeightOf(neighborhood);
    const missingBlocks = await this.block.missingBlockHeightsForNeighborhood(
      neighborhood,
      latestHeight,
      this.schedulerConfig.maxBlocks,
    );

    if (missingBlocks.length == 0) {
      this.logger.debug("No new block to fetch");
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
    this.logger.debug(
      `Done ${missingBlocks.length} blocks ${missingBlocks[0]}..=${
        missingBlocks[missingBlocks.length - 1]
      }`,
    );
  }

  async run() {
    const n = this.n;

    await this.step(
      () => this.checkIfNeighborhoodHasBeenReset(n),
      n.id,
      "reset neighborhood if necessary",
    );
    await this.step(
      () => this.updateNeighborhoodEarliestMissingBlocks(n),
      n.id,
      "updating missing blocks",
    );
    await this.step(
      () => this.updateNeighborhoodMissingTransactionDetails(n),
      n.id,
      "updating transaction details",
    );
  }
}
