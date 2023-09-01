import { Inject, Injectable, Logger } from "@nestjs/common";
import { SchedulerRegistry } from "@nestjs/schedule";
import { CronJob } from "cron";
import { MetricQuery } from "../../database/entities/metric-query.entity";
import { MetricsSchedulerConfigService } from "../../config/metrics-scheduler/configuration.service";
import { MetricQueryService } from "../../metrics/metric-query/query.service";
import { MetricUpdater } from "../metrics-scheduler/metric-updater/updater";

@Injectable()
export class MetricsSchedulerService {
  private readonly logger = new Logger(MetricsSchedulerService.name);
  private done = true;

  constructor(
    private schedulerRegistry: SchedulerRegistry,
    private metricsSchedulerConfig: MetricsSchedulerConfigService,
    private prometheusQuery: MetricQueryService,
    @Inject("PROMETHEUS_QUERY_FACTORY")
    private readonly updaterFactory: (n: MetricQuery) => MetricUpdater,
  ) {
    const jobFn = () => this.run();

    if (metricsSchedulerConfig.cron !== undefined) {
      // Do not rerun the cron job if the previous one was done.
      const job = new CronJob(metricsSchedulerConfig.cron, jobFn);
      this.logger.log(`Cron scheduled: ${metricsSchedulerConfig.cron}`);
      this.schedulerRegistry.addCronJob("updateMetrics", job);
      job.start();
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
      const enabled = prometheusQueries.filter((n) => n.enabled);

      this.logger.debug(`Updating ${enabled.length} prometheusQueries.`);

      // Do all prometheusQueries in parallel
      await Promise.all(
        prometheusQueries.map(async (n) => {
          if (n.enabled && n.querytype == "prometheus") {
            const i = await this.updaterFactory(n);
            await i.run();
          } else {
            this.logger.debug(
              `Skipping disabled prometheusquery id: ${n.id} name: ${n.name}.`,
            );
          }
        }),
      );
      this.logger.debug(`Done`);
    } else {
      this.logger.debug("No prometheus queries in database...");
    }
  }
}
