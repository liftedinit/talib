import { Inject, Injectable, Logger } from "@nestjs/common";
import { SchedulerRegistry } from "@nestjs/schedule";
import { CronJob } from "cron";
import { PrometheusQuery } from "src/database/entities/prometheus-query.entity";
import { MetricsSchedulerConfigService } from "../../config/metrics-scheduler/configuration.service";
import { PrometheusQueryService } from "../../metrics/prometheus-query/query.service";
import { MetricUpdater } from "../metrics-scheduler/metric-updater/updater";
import { Query } from "typeorm/driver/Query.js";

@Injectable()
export class MetricsSchedulerService {
  private readonly logger = new Logger(MetricsSchedulerService.name);
  private done = true;

  constructor(
    private schedulerRegistry: SchedulerRegistry,
    private metricsSchedulerConfig: MetricsSchedulerConfigService,
    private prometheusQuery: PrometheusQueryService,
    @Inject("PROMETHEUS_QUERY_FACTORY")
    private readonly updaterFactory: (n: PrometheusQuery) => MetricUpdater,
  ) {
    const jobFn = () => this.run();

    if (metricsSchedulerConfig.cron !== undefined) {
      // Do not rerun the cron job if the previous one was done.
      const job = new CronJob(metricsSchedulerConfig.cron, jobFn);
      this.logger.log(`Cron scheduled: ${metricsSchedulerConfig.cron}`);
      this.schedulerRegistry.addCronJob("updateMetrics", job);
      job.start();
    } else if (metricsSchedulerConfig.seconds !== undefined) {
      const id = setInterval(jobFn, metricsSchedulerConfig.seconds * 1000);
      this.logger.log(
        `Interval scheduled: ${metricsSchedulerConfig.seconds}sec`,
      );
      this.schedulerRegistry.addInterval("updateMetrics", id);
    } else {
      this.logger.log(`Scheduler disabled.`);
    }
  }

  async run() {
    if (this.done) {
      this.done = false;
      this.logger.log("Starting new metrics scheduler run...");
      try {
        await this.updateMetrics();
      } catch (err) {
        this.logger.error(`Error during update: ${err}`);
      }
      // On error, hope for the best next time.
      this.done = true;
    }
  }

  async updateMetrics() {
    const prometheusQueries = await this.prometheusQuery.findAll();

    if (prometheusQueries.length > 0) {
      this.logger.debug(
        `Updating ${prometheusQueries.length} prometheusQueries.`,
      );

      // Do all prometheusQueries in parallel.
      await Promise.all(
        prometheusQueries.map(async (n) => {
          const i = await this.updaterFactory(n);
          await i.run();
        }),
      );
      this.logger.debug(`Done`);
    } else {
      this.logger.debug("No prometheus queries in database...");
    }
  }
}
