import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, QueryFailedError } from "typeorm";
import { MetricsSchedulerConfigService } from "src/config/metrics-scheduler/configuration.service";
import { Metric } from "../../../database/entities/metric.entity";
import { PrometheusQuery } from "src/database/entities/prometheus-query.entity";
import { MetricsService } from "../../../metrics/metrics.service";
import { PrometheusQueryDetailsService } from "src/metrics/prometheus-query-details/query-details.service";
// import { MetricAnalyzerService } from "../metrics-analyzer.service";

const FROM = "now-5m";
const TO = "now";
const INTERVALMS = 30000;
const MAXDATAPOINTS = 3000;
const MAX_HOURS = 48;

@Injectable()
export class MetricUpdater {
  private logger: Logger;
  private p: PrometheusQuery;

  constructor(
    private schedulerConfig: MetricsSchedulerConfigService,
    private metric: MetricsService,
    private prometheusQueryDetails: PrometheusQueryDetailsService,
    // private metricAnalyzer: MetricAnalyzerService,
    @InjectRepository(Metric)
    private metricRepository: Repository<Metric>,
  ) {}

  with(p: PrometheusQuery) {
    this.p = p;
    this.logger = new Logger(`${MetricUpdater.name}(${p.id})`);
    return this;
  }

  private async updateMetricNewValues(p: PrometheusQuery, timestamp) {
    const latestMetric =
      await this.prometheusQueryDetails.getPrometheusQuerySingleValue(
        p.name,
        timestamp,
        INTERVALMS,
        MAXDATAPOINTS,
      );

    // this.logger.debug(
    //   `latestMetric for ${p.name} = timestamp: ${JSON.stringify(
    //     new Date(latestMetric[0]),
    //   )} data: ${JSON.stringify(latestMetric[1])}`,
    // );

    const entity = new Metric();
    entity.prometheusQueryId = p;
    entity.timestamp = new Date(latestMetric[0]);
    entity.data = latestMetric[1];

    const result = await this.metricRepository.save(entity);

    return result;
  }

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

    const checkBatchSize =
      currentDate.getTime() - seedMetricStartDate < defaultBatchSize * this.schedulerConfig.interval;

    const calculatedBatchSize =
      (currentDate.getTime() - seedMetricStartDate) / this.schedulerConfig.interval;

    if (checkBatchSize) {
      maxBatch = (currentDate.getTime() - seedMetricStartDate) / this.schedulerConfig.interval;
    } else {
      this.logger.debug(`Remainig batch for ${p.name}: ${calculatedBatchSize}`);
      maxBatch = defaultBatchSize;
    }

    let seedMetricTimestamp = seedMetricStartDate;
    if (maxBatch < 10) {
      this.logger.debug(`Batch Size less than 10...skipping job.`);
    } else {
      for (let i = 0; i < maxBatch; i++) {
        try {
          await this.updateMetricNewValues(p, seedMetricTimestamp);
          // Increase timestamp 5 mins for next metric
        } catch (error) {
          if (
            error instanceof QueryFailedError &&
            error.message.includes("unique constraint")
          ) {
          } else if (error.message.includes("undefined")) {
          } else {
            this.logger.debug(
              `Error Cause ${error.message} for query ${p.name} ${seedMetricTimestamp}`,
            );
          }
        }

        seedMetricTimestamp += this.schedulerConfig.interval;
      }
    }

    return null;
  }

  async run() {
    const p = this.p;
    try {
      this.logger.debug(`seeding metric: ${p.name}`);
      await this.seedMetricValues(p);
    } catch (e) {
      this.logger.log(`Error happened while updating metrics:\n${e.stack}`);
    }
  }
}
