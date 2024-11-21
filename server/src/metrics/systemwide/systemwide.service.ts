import { Inject, Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { SystemWideMetric as SystemWideEntity } from "../../database/entities/systemwide-metric.entity";
import { CreateSystemWideMetricDto } from "../../dto/systemwide-metric.dto";
import { DataSource, Repository } from "typeorm";
import { Transaction as TransactionEntity } from "../../database/entities/transaction.entity";
import { FindOneOptions } from 'typeorm';
import { MetricsService, SeriesEntity } from "../metrics.service";
import { Metric as MetricEntity } from "../../database/entities/metric.entity";
import { PrometheusQuery } from "../../database/entities/prometheus-query.entity";

const INTERVALMS = 600000;

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
    metrics: PrometheusQuery[],
    ) {
    for (let i = 0; i < metrics.length; i++) {
      try {
        // Check if the metric has a last update less than the update interval
        const lastUpdate = await this.metricService.getCurrent(metrics[i].name);

        // If the metric was updated less than the update interval, skip it
        if (lastUpdate) {
          const now = new Date();
          const lastUpdateDate = new Date(lastUpdate.timestamp);
          const diff = now.getTime() - lastUpdateDate.getTime();

          this.logger.debug(`Last update for ${metrics[i].name} was ${diff}ms ago`);
          if (diff < INTERVALMS) {
            this.logger.debug(`Skipping systemwide metric ${metrics[i].name}, updated less than ${(INTERVALMS / 1000 / 60)} minutes ago`);
            continue;
          } else {
            await this.updateMetricByQuery(metrics[i]);
            this.logger.log(`Done running seedSystemwideMetrics: ${metrics[i].name}`);
          }
        }
        
      } catch (err) {
        this.logger.error(`Error during seeding systemwide metric: ${err}`);
      }
      
    }
  }

  // Get all metrics in the prometheusQueryRepository that have queryType database
  private async getSystemWideMetrics() {
    const metrics = await this.prometheusQueryRepository.find({ where: { queryType: 'database' } });

    return metrics;
  }

  // Update all SystemWideMetrics
  async updateSystemWideMetrics() {
    const metrics = await this.getSystemWideMetrics();

    await this.seedSystemWideMetrics(metrics);
  }

}
