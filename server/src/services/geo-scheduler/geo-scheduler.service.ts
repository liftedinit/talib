import { Inject, Injectable, Logger } from "@nestjs/common";
import { SchedulerRegistry } from "@nestjs/schedule";
import { CronJob } from "cron";
import { PrometheusQuery } from "../../database/entities/prometheus-query.entity";
import { GeoSchedulerConfigService } from "../../config/geo-scheduler/configuration.service";
import { PrometheusQueryService } from "../../metrics/prometheus-query/query.service";
import { GeoUpdater } from "../geo-scheduler/geo-updater/updater";

export interface PrometheusQueries {
  latitude: PrometheusQuery;
  longitude: PrometheusQuery;
}

@Injectable()
export class GeoSchedulerService {
  private readonly logger = new Logger(GeoSchedulerService.name);
  private done = true;

  constructor(
    private schedulerRegistry: SchedulerRegistry,
    private geoSchedulerConfig: GeoSchedulerConfigService,
    private prometheusQuery: PrometheusQueryService,
    @Inject("PROMETHEUS_QUERIES_FACTORY")
    private readonly updaterFactory: (n: PrometheusQueries) => GeoUpdater,
  ) {
    const jobFn = () => this.run();

    if ( this.geoSchedulerConfig.cron !== undefined) {
      // Do not rerun the cron job if the previous one was done.
      const job = new CronJob(this.geoSchedulerConfig.cron, jobFn);
      this.logger.log(`Cron scheduled: ${this.geoSchedulerConfig.cron}`);
      this.schedulerRegistry.addCronJob("updateLocations", job);
      job.start();
    } else {
      this.logger.log(`Scheduler disabled.`);
    }
  }

  async run() {
    if (this.done) {
      this.done = false;
      this.logger.log("Starting new geo scheduler run...");
      try {
        await this.updateLocations();
      } catch (err) {
        this.logger.error(`Error during update: ${err}`);
      }
      // On error, hope for the best next time.
      this.done = true;
    }
  }

  async updateLocations() {
    const latitudeQuery = await this.prometheusQuery.get('latitude');
    const longitudeQuery = await this.prometheusQuery.get('longitude');
    
    const prometheusQueries = {
      latitude: latitudeQuery, 
      longitude: longitudeQuery 
    };

    // Check if queries are found to continue with location scheduler
    if (prometheusQueries !== undefined 
      && prometheusQueries.latitude !== undefined 
      && prometheusQueries.longitude !== undefined) {
      // Pass prometheus queries for latitude and longitude to GeoUpdater
      const i = await this.updaterFactory(prometheusQueries);
      await i.run();
      this.logger.debug(`Done`);
    } else {
      this.logger.debug("No prometheus location queries in database...");
    }
  }
}
