import { NetworkService } from './network.service';
import { Injectable, Logger } from '@nestjs/common';
import { NeighborhoodService } from '../neighborhoods/neighborhood.service';
import { BlockService } from '../neighborhoods/blocks/block.service';
import { SchedulerRegistry } from '@nestjs/schedule';
import { SchedulerConfigService } from '../config/scheduler/configuration.service';
import { CronJob } from 'cron';
import { Neighborhood } from '../neighborhoods/neighborhood.entity';

@Injectable()
export class SchedulerService {
  constructor(
    private logger: Logger,
    private schedulerConfig: SchedulerConfigService,
    private schedulerRegistry: SchedulerRegistry,
    private network: NetworkService,
    private neighborhood: NeighborhoodService,
    private block: BlockService,
  ) {
    let done = true;

    const jobFn = async () => {
      if (done) {
        done = false;
        try {
          await this.updateEarliestMissingBlocks();
        } catch (err) {
          this.logger.error(`Error during update: ${err}`);
        }
        // On error, hope for the best next time.
        done = true;
      } else {
        this.logger.debug('Last job was not finished, skipping...');
      }
    };

    if (schedulerConfig.cron !== undefined) {
      // Do not rerun the cron job if the previous one was done.
      const job = new CronJob(schedulerConfig.cron, jobFn);
      this.schedulerRegistry.addCronJob('updateNeighborhood', job);
      job.start();
    } else if (schedulerConfig.seconds !== undefined) {
      const id = setInterval(jobFn, schedulerConfig.seconds * 1000);
      this.schedulerRegistry.addInterval('updateNeighborhood', id);
    }
  }

  async updateEarliestMissingBlocks() {
    const neighborhoods = await this.neighborhood.findAll();

    if (neighborhoods.length > 0) {
      this.logger.debug(`Updating ${neighborhoods.length} neighborhoods.`);

      // Do all neighborhoods in parallel.
      await Promise.all(
        neighborhoods.map((n) =>
          (async () => {
            await this.block.createLatestOf(n);
            try {
              await this.updateNeighborhoodEarliestMissingBlocks(n);
            } catch (e) {
              this.logger.warn(
                `Error happened during update: ${e}. Will wait for the next job to resume`,
              );
            }
          })(),
        ),
      );

      this.logger.debug(`Done.`);
    }
  }

  async updateNeighborhoodEarliestMissingBlocks(neighbordhood: Neighborhood) {
    const network = await this.network.forUrl(neighbordhood.url);
    const missingBlocks = await this.block.missingBlockHeightsForNeighborhood(
      neighbordhood,
      this.schedulerConfig.maxBlocks,
    );

    if (missingBlocks.length == 0) {
      // Nothing to do, save some math.
      return;
    }

    // Split missing blocks into groups of parallel.
    const parallel = this.schedulerConfig.parallel;
    const parallel_sleep = this.schedulerConfig.parallel_sleep;
    const schedule = [];
    for (let i = 0; i < missingBlocks.length; i += parallel) {
      schedule[schedule.length] = missingBlocks.slice(i, i + parallel);
    }

    for (const batch of schedule) {
      this.logger.debug(
        `Neighborhood ${neighbordhood.id}: getting height ${batch[0]}..=${
          batch[batch.length - 1]
        }`,
      );

      await Promise.all(
        batch.map((height) =>
          (async () => {
            const blockInfo = await network.blockchain.blockByHeight(height);
            await this.block.createFromManyBlock(neighbordhood, blockInfo);
          })(),
        ),
      );

      // Sleep a bit.
      await new Promise((res) => setTimeout(res, parallel_sleep * 1000));
    }
    this.logger.debug(
      `Neighborhood ${neighbordhood.id}: done ${missingBlocks.length} blocks (${
        missingBlocks[0]
      }..=${missingBlocks[missingBlocks.length - 1]})`,
    );
  }
}
