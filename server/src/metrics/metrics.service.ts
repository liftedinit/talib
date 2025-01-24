import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from "nestjs-typeorm-paginate";
import { Repository } from "typeorm";
import { Metric as MetricEntity } from "../database/entities/metric.entity";
import { PrometheusQuery } from "../database/entities/prometheus-query.entity";
import { PrometheusQueryService } from "./prometheus-query/query.service";
import { MetricsSchedulerConfigService } from "../config/metrics-scheduler/configuration.service"
import { CreateMetricDto } from "../dto/metric.dto";

export interface SeriesEntity {
  data: number[] | string[];
  timestamps: Date[];
}

@Injectable()
export class MetricsService {
  private readonly logger = new Logger(MetricsService.name);

  constructor(
    @InjectRepository(MetricEntity)
    private metricRepository: Repository<MetricEntity>,
    @InjectRepository(PrometheusQuery)
    private prometheusQueryRepository: Repository<PrometheusQuery>,
    private prometheusQuery: PrometheusQueryService,
    private schedulerConfig: MetricsSchedulerConfigService,
  ) {}

  findAll(): Promise<MetricEntity[]> {
    return this.metricRepository.find();
  }

  // Retrieve many metrics by query ID
  public async findMany(
    prometheusQueryId: number,
    options: IPaginationOptions,
  ): Promise<Pagination<MetricEntity>> {
    const query = this.metricRepository
      .createQueryBuilder("m")
      .where("m.prometheusQueryId = :id", { id: prometheusQueryId })
      .orderBy("m.timestamp", "DESC")
      .limit(500);

    return await paginate(query, options);
  }

  // Get the current value for a metric
  async getCurrent(name: string): Promise<MetricEntity | null> {
    try {
      const prometheusQuery = await this.prometheusQuery.get(name);
  
      const query = this.metricRepository
        .createQueryBuilder("m")
        .where("m.prometheusQueryId = :prometheusQuery", {
          prometheusQuery: prometheusQuery.id,
        })
        .orderBy("m.timestamp", "DESC")
        .limit(1);
  
      const one = await query.getOne();
  
      if (!one) {
        return null;
      }
  
      return one;
    } catch (error) {
      this.logger.error(`Error fetching metrics for query: ${name}`);
      return null;
    }
  }

  filterOutliers(data: number[]): number[] {
    const filteredData: number[] = [];
    const lookback = 72; // Look back 72 data points
    const percentDiff = 0.90; // Acceptable deviation (90% difference)
  
    for (let i = 0; i < data.length; i++) {
      const previousValues = data.slice(Math.max(i - lookback, 0), i);
      const currentValue = data[i];
  
      if (previousValues.length === 0) {
        // No previous values, include the first data point as-is
        filteredData.push(currentValue);
        continue;
      }
  
      // Calculate average of previous values
      const averageValue =
        previousValues.reduce((sum, val) => sum + val, 0) / previousValues.length;
  
      // Calculate acceptable bounds
      const lowerBound = averageValue * (1 - percentDiff);
      const upperBound = averageValue * (1 + percentDiff);
  
      // Include the value only if it falls within bounds
      if (currentValue >= lowerBound && currentValue <= upperBound) {
        filteredData.push(currentValue);
      } else {
        // Use the average value as a fallback
        filteredData.push(averageValue);
      }
    }
  
    return filteredData;
  }

  simpleMovingAverage(data: number[], windowSize: number): number[] {
    const sma: number[] = [];

    for (let i = 0; i <= data.length - windowSize; i++) {
      const window = data.slice(i, i + windowSize);
      const average =
        window.reduce((sum, value) => sum + value, 0) / windowSize;
      sma.push(average);
    }

    return sma;
  }

  async getSeries(
    name: string,
    from: Date,
    to: Date,
    smoothed: boolean,
    windowSize?: number,
  ): Promise<SeriesEntity[] | null> {
    try {
      const prometheusQuery = await this.prometheusQuery.get(name);

      const query = this.metricRepository
        .createQueryBuilder("m")
        .where("m.timestamp BETWEEN :to AND :from", {
          from,
          to,
        })
        .andWhere("m.prometheusQueryId = :prometheusQuery", {
          prometheusQuery: prometheusQuery.id,
        })
        .orderBy("m.timestamp", "DESC");

      const result: MetricEntity[] | null = await query.getMany();

      // Initialize arrays for data processing
      const seriesData: SeriesEntity[] = [];
      const data: number[] = [];
      const timestamps: Date[] = [];

      result.forEach((series) => {
        data.push(Number(series.data));
        timestamps.push(series.timestamp);
      });

      let processedData: number[];

      if (smoothed) {
        if (!windowSize) {
          windowSize = 18;
        }
        // Filter outliers and normalize the data
        const filteredData = this.filterOutliers(data);
        processedData = this.simpleMovingAverage(filteredData, windowSize);
      } else {
        processedData = data;
      }

      // Populate return object
      seriesData.push({
        timestamps: timestamps,
        data: processedData,
      });

      return seriesData;
    } catch (error) {
      this.logger.error(`Error fetching metrics for query: ${name} ${error}`);
      return null;
    }
  }

  // Returns the startdate of the metric being tracked from
  // the most recent value in the database
  async seedMetricStartDate(
    PrometheusQueryCreatedDate: Date,
    prometheusQueryId: number,
  ) {
    let startDate: number;

    // Fetch the metric's latest entry from the data points stored
    // in the metrics table
    let latestDate;
    try {
      latestDate = await this.metricRepository
        .createQueryBuilder("m")
        .where({ prometheusQueryId: prometheusQueryId })
        .orderBy("m.timestamp", "DESC")
        .getOne();
    } catch (error) {
      this.logger.debug(`Error in fetching latest date: ${error}`);
    }

    // Set timestamp from the most recent row, if exists
    const timestamp = latestDate?.timestamp || null;

    // Fetch the date stored in the prometheus query config table
    const startdate_timestamp = PrometheusQueryCreatedDate.getTime();
    const timestamp_formatted = new Date(timestamp).getTime();

    // Check if timestamp exists and is greater than the query creation date
    // This means data exists and should continue from the most recent point
    if (timestamp != null && timestamp_formatted > startdate_timestamp) {
      startDate = timestamp_formatted;
    } else {
      // If no timestamp exists, set timestamp to the prometheus query creation date
      // This should only occur if data is reset or no metric data exists for a new query
      startDate = startdate_timestamp;
    }

    return startDate;
  }

  public async save(entities: MetricEntity[]): Promise<void> {
    await this.metricRepository.save(entities);
  }

  async updateMetricByName(
    name: string,
    createMetricDto: Partial<CreateMetricDto>,
  ): Promise<MetricEntity> {
    const query = await this.prometheusQueryRepository.findOne({ where: { name } });

    if (!query) {
      return undefined;
    }

    this.logger.debug(`createMetricDto: ${JSON.stringify(createMetricDto)}`); 

    const metric = new MetricEntity();
    metric.prometheusQueryId = query;
    if (createMetricDto.timestamp) {
      metric.timestamp = createMetricDto.timestamp;
    } else {
      metric.timestamp = new Date();
    }
    metric.data = createMetricDto.data;

    this.logger.debug(`Updating metric ${name} with ${JSON.stringify(metric)}`);

    return this.metricRepository.save(metric);
  }

  async removeByPrometheusQueryName(name: string): Promise<void> {
    const prometheusQuery = await this.prometheusQuery.get(name);
    this.logger.debug(`Deleting metrics with name:  ${prometheusQuery.name}`);
    await this.metricRepository
      .createQueryBuilder()
      .delete()
      .from(MetricEntity)
      .where("prometheusQueryId = :id", { id: prometheusQuery.id })
      .execute();
  }
}
