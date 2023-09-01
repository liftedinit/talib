import { Inject, Injectable, Logger } from "@nestjs/common";
import { SchedulerRegistry } from "@nestjs/schedule";
import { CronJob } from "cron";
import { SchedulerConfigService } from "../../config/scheduler/configuration.service";
import { Neighborhood } from "../../database/entities/neighborhood.entity";
import { NeighborhoodService } from "../../neighborhoods/neighborhood.service";
import { NeighborhoodUpdater } from "./neighborhood-updater/updater";
import { NeighborhoodInfoUpdater } from "./info-updater/updater";

@Injectable()
export class SchedulerService {
  private readonly logger = new Logger(SchedulerService.name);
  private done = true;

  constructor(
    private schedulerRegistry: SchedulerRegistry,
    private schedulerConfig: SchedulerConfigService,
    private neighborhood: NeighborhoodService,
    @Inject("NEIGHBORHOOD_FACTORY")
    private readonly updaterFactory: (n: Neighborhood) => NeighborhoodUpdater,
    @Inject("NEIGHBORHOOD_INFO_FACTORY")
    private readonly infoUpdaterFactory: (
      n: Neighborhood,
    ) => NeighborhoodInfoUpdater,
  ) {
    const jobFn = () => this.run();

    if (schedulerConfig.cron !== undefined) {
      // Do not rerun the cron job if the previous one was done.
      const job = new CronJob(schedulerConfig.cron, jobFn);
      this.logger.log(`Cron scheduled: ${schedulerConfig.cron}`);
      this.schedulerRegistry.addCronJob("updateNeighborhood", job);
      job.start();
    } else if (schedulerConfig.seconds !== undefined) {
      const id = setInterval(jobFn, schedulerConfig.seconds * 1000);
      this.logger.log(`Interval scheduled: ${schedulerConfig.seconds}sec`);
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

  async updateNeighborhoods() {
    const neighborhoods = await this.neighborhood.findAll();

    if (neighborhoods.length > 0) {
      const enabled = neighborhoods.filter((n) => n.enabled);

      this.logger.debug(`Updating ${enabled.length} neighborhoods.`);

      // Do all neighborhoods in parallel.
      await Promise.all(
        neighborhoods.map(async (n) => {
          if (n.enabled) {
            // Run neighborhood updater
            const u = await this.updaterFactory(n);
            await u.run();

            // Run neighborhood info updater
            const i = await this.infoUpdaterFactory(n);
            await i.run();
          } else {
            this.logger.debug(
              `Skipping disabled neighborhood id: ${n.id} name: ${n.name}.`,
            );
          }
        }),
      );
      this.logger.debug(`Done`);
    } else {
      this.logger.debug("No neighborhoods in database...");
    }
  }
}
