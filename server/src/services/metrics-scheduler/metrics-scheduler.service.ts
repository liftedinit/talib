import { Inject, Injectable, Logger } from "@nestjs/common";
import { SchedulerRegistry } from "@nestjs/schedule";
import { CronJob } from "cron";
import { PrometheusQuery } from "../../database/entities/prometheus-query.entity";
import { SystemWideService } from "../../metrics/systemwide/systemwide.service";
import { MetricsSchedulerConfigService } from "../../config/metrics-scheduler/configuration.service";
import { PrometheusQueryService } from "../../metrics/prometheus-query/query.service";
import { MetricUpdater } from "../metrics-scheduler/metric-updater/updater";

@Injectable()
export class MetricsSchedulerService {
  private readonly logger = new Logger(MetricsSchedulerService.name);
  private done = true;

  constructor(
    private schedulerRegistry: SchedulerRegistry,
    private metricsSchedulerConfig: MetricsSchedulerConfigService,
    private prometheusQuery: PrometheusQueryService,
    private systemWideService: SystemWideService,
    @Inject("PROMETHEUS_QUERY_FACTORY")
    private readonly updaterFactory: (n: PrometheusQuery) => MetricUpdater,
  ) {
    const jobFn = () => this.run();

    if (this.metricsSchedulerConfig.cron !== undefined) {
      // Do not rerun the cron job if the previous one was done.
      const job = new CronJob(this.metricsSchedulerConfig.cron, jobFn);
      this.logger.log(`Cron scheduled: ${this.metricsSchedulerConfig.cron}`);
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

      this.logger.log(`Updating ${enabled.length} prometheusQueries.`);

      try {
        this.logger.debug('Starting to update prometheusQueries...');
        await Promise.all(
          prometheusQueries.map(async (n) => {
            if (n.enabled && n.queryType === 'prometheus') {
              try {
                this.logger.debug(`Running updater for prometheusquery id: ${n.id} name: ${n.name}.`);
                const i = await this.updaterFactory(n);
                await i.run();
                this.logger.debug(`Successfully ran updater for prometheusquery id: ${n.id} name: ${n.name}.`);
              } catch (error) {
                this.logger.error(`Error running updater for prometheusquery id: ${n.id} name: ${n.name}.`, error);
              }
            } else {
              this.logger.debug(
                `Skipping disabled prometheusquery id: ${n.id} name: ${n.name}.`,
              );
            }
          }),
        );
        this.logger.log('Done updating prometheusQueries.');
      } catch (error) {
        this.logger.error('Error in Promise.all for prometheusQueries', error);
      }

      this.logger.log(`Updating SystemWide Metrics...`);
      try {
        this.logger.debug('Starting to update prometheusQueries for database queryType...');
        await Promise.all(
          prometheusQueries.map(async (d) => {
            if (d.enabled && d.queryType === 'database') {
              try {
                this.logger.debug(`Running updater for metric database query id: ${d.id} name: ${d.name}.`);
                await this.systemWideService.updateSystemWideMetrics(d);
                this.logger.debug(`Successfully ran updater for metric database query id: ${d.id} name: ${d.name}.`);
              } catch (error) {
                this.logger.error(`Error running updater for metric database query id: ${d.id} name: ${d.name}.`, error);
              }
            } else {
              this.logger.debug(
                `Skipping disabled database query id:: ${d.id} name: ${d.name}.`,
              );
            }
          }),
        );
        this.logger.log('Done updating metric database queries.');
      } catch (error) {
        this.logger.error('Error in updating metric database queries', error);
      }


    } else {
      this.logger.debug("No prometheus queries in database...");
    }
  }
}
