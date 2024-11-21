import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { MetricsService } from "../metrics.service";
import { Metric as MetricEntity } from "../../database/entities/metric.entity";
import { PrometheusQuery } from "../../database/entities/prometheus-query.entity";
import { MetricsSchedulerConfigService } from "src/config/metrics-scheduler/configuration.service";

@Injectable()
export class SystemWideService {
  private readonly logger = new Logger(SystemWideService.name);

  constructor(
    @InjectRepository(MetricEntity)
    private metricRepository: Repository<MetricEntity>,
    @InjectRepository(PrometheusQuery)
    private prometheusQueryRepository: Repository<PrometheusQuery>,
    private metricService: MetricsService,
    private dataSource: DataSource,
    private schedulerConfig: MetricsSchedulerConfigService
  ) {}

  async updateMetricByQuery(metricQuery: PrometheusQuery): Promise<MetricEntity> {
    const query = await this.prometheusQueryRepository.findOne({ where: { id: metricQuery.id } });

    if (!query) {
      throw new Error(`PrometheusQuery with name ${query.name} not found`);
    }

    const result = await this.dataSource.query(query.query);

    if (!result || result.length === 0) {
      throw new Error('Query returned no results');
    }

    const metric = new MetricEntity();
    metric.prometheusQueryId = query;
    metric.timestamp = new Date();
    metric.data = String(Object.values(result[0])[0]);

    return this.metricRepository.save(metric);

  }

  // Seed all SystemWideMetrics into the database
  private async seedSystemWideMetrics(
    query: PrometheusQuery,
    ) {

      try {
        // Check if the metric has a last update less than the update interval
        const lastUpdate = await this.metricService.getCurrent(query.name);

        // If there is no last update, proceed to update the metric
        if (!lastUpdate) {
          await this.updateMetricByQuery(query);
          this.logger.log(`Initial seed of database metric in seedSystemwideMetrics for: ${query.name}`);
        } else {
          const now = new Date();
          const lastUpdateDate = new Date(lastUpdate.timestamp);
          const diff = now.getTime() - lastUpdateDate.getTime();

          if (diff < this.schedulerConfig.interval) {
            this.logger.debug(`Skipping systemwide metric ${query.name}, updated less than ${(this.schedulerConfig.interval / 1000 / 60)} minutes ago`);
          } else {
            await this.updateMetricByQuery(query);
            this.logger.log(`Done running seedSystemwideMetrics: ${query.name}`);
          }
        }
        
      } catch (err) {
        this.logger.error(`Error during seeding systemwide metric: ${err}`);
      }
  }

  // Update all SystemWideMetrics
  async updateSystemWideMetrics(query: PrometheusQuery) {
    await this.seedSystemWideMetrics(query);
  }
}
