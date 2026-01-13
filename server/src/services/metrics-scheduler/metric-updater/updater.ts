import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { MetricsSchedulerConfigService } from "src/config/metrics-scheduler/configuration.service";
import { Metric } from "../../../database/entities/metric.entity";
import { PrometheusQuery } from "src/database/entities/prometheus-query.entity";
import { MetricsService } from "../../../metrics/metrics.service";
import { PrometheusQueryDetailsService } from "src/metrics/prometheus-query-details/query-details.service";

const INTERVALMS = 30000;
const MAXDATAPOINTS = 30;

@Injectable()
export class MetricUpdater {
  private logger: Logger;
  private p: PrometheusQuery;

  constructor(
    private schedulerConfig: MetricsSchedulerConfigService,
    private metric: MetricsService,
    private prometheusQueryDetails: PrometheusQueryDetailsService,
    @InjectRepository(Metric)
    private metricRepository: Repository<Metric>,
  ) {}

  with(p: PrometheusQuery) {
    this.p = p;
    this.logger = new Logger(`${MetricUpdater.name}(${p.id})`);
    return this;
  }

  // Insert a new metric value into the metrics table
  private async updateMetricNewValues(p: PrometheusQuery, timestamp) {
    // Retrieve the metric value from Grafana
    // Fetch the PromQL from the PrometheusQuery table to find the metric
    const latestMetric =
      await this.prometheusQueryDetails.getPrometheusQuerySingleValue(
        p.name,
        timestamp,
        INTERVALMS,
        MAXDATAPOINTS,
      );

    // Insert metric with ON CONFLICT DO NOTHING to avoid duplicate key errors
    const result = await this.metricRepository
      .createQueryBuilder()
      .insert()
      .into(Metric)
      .values({
        prometheusQueryId: p,
        timestamp: new Date(latestMetric[0]),
        data: latestMetric[1],
      })
      .orIgnore()
      .execute();

    return result;
  }

  // Seed metric values for a prometheusQuery
  // This is the main job of the metrics scheduler
  private async seedMetricValues(p: PrometheusQuery) {
    // Get date of last metric for PrometheusQuery
    const PrometheusQueryId = p.id;
    const PrometheusQueryCreatedDate = p.createdDate;
    const seedMetricStartDate = await this.metric.seedMetricStartDate(
      PrometheusQueryCreatedDate,
      PrometheusQueryId,
    );

    const currentDate = new Date();
    let maxBatch: number;
    const defaultBatchSize = this.schedulerConfig.batch_size;
    const minBatchSize = this.schedulerConfig.min_batch_size;

    // Check if the batch size remaining is less than the default batch size, boolean
    const checkBatchSize =
      currentDate.getTime() - seedMetricStartDate < defaultBatchSize * this.schedulerConfig.interval;

    // Calculate the total batch size
    const calculatedBatchSize =
      (currentDate.getTime() - seedMetricStartDate) / this.schedulerConfig.interval;

    // If batch size is less than max batch size, set the batch size to the required amount
    // Prevents running excess queries when job is all caught up
    if (checkBatchSize) {
      maxBatch =
        (currentDate.getTime() - seedMetricStartDate) /
        this.schedulerConfig.interval;
    } else {
      this.logger.debug(`Remainig batch for ${p.name}: ${calculatedBatchSize}`);
      maxBatch = defaultBatchSize;
    }

    // Init local var for incrementing
    let seedMetricTimestamp = seedMetricStartDate;
    // If there are less than 10 metrics to collect, skip this scheduled job
    if (maxBatch < minBatchSize) {
      this.logger.debug(`Batch Size less than ${minBatchSize} for ${p.name}...skipping job.`);
    } else {
      for (let i = 0; i < maxBatch; i++) {
        try {
          // Try to update a new metric
          // This will use the incremented value from below to collect the next
          // data point from Grafana/Prometheus and store in the metrics table
          await this.updateMetricNewValues(p, seedMetricTimestamp);
          this.logger.debug(`Done running updateMetricNewValues: ${p.name}.`)
        } catch (error) {
          this.logger.debug(
            `Error: ${error.message} for query ${p.name} ${seedMetricTimestamp}`,
          );
        }
        // Inccrement timestamp by the interval (e.g. 10mins)
        seedMetricTimestamp += this.schedulerConfig.interval;
      }
    }

    this.logger.log(`Done running seedMetricValues: ${p.name}.`)
    return null;
  }

  async run() {
    const p = this.p;
    try {
      this.logger.debug(`seeding metric: ${p.name}`);
      await this.seedMetricValues(p);
    } catch (e) {
      this.logger.error(`Error happened while updating metrics:\n${e.stack}`);
    }
  }
}
