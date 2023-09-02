import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from "nestjs-typeorm-paginate";
import { Repository } from "typeorm";
import { Metric as MetricEntity } from "../database/entities/metric.entity";
import { MetricQueryService } from "./metric-query/query.service";
import { MetricsSchedulerConfigService } from "../config/metrics-scheduler/configuration.service";

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
    private metricQuery: MetricQueryService,
    private schedulerConfig: MetricsSchedulerConfigService,
  ) {}

  findAll(): Promise<MetricEntity[]> {
    return this.metricRepository.find();
  }

  // Retrieve many metrics by query ID
  public async findMany(
    metricQueryId: number,
    options: IPaginationOptions,
  ): Promise<Pagination<MetricEntity>> {
    const query = this.metricRepository
      .createQueryBuilder("m")
      .where("m.metricQueryId = :id", { id: metricQueryId })
      .orderBy("m.timestamp", "DESC")
      .limit(500);

    return await paginate(query, options);
  }

  // Get the current value for a metric
  async getCurrent(name: string): Promise<MetricEntity | null> {
    const metricQuery = await this.metricQuery.get(name);

    const query = this.metricRepository
      .createQueryBuilder("m")
      .where("m.metricQueryId = :metricQuery", {
        metricQuery: metricQuery.id,
      })
      .orderBy("m.timestamp", "DESC")
      .limit(1);

    const one = await query.getOne();

    if (!one) {
      return null;
    }

    return one;
  }

  // Lookback and remove the 95th percent difference of outliers
  filterOutliers(data: number[]): number[] {
    const filteredData: number[] = [];

    let max = 0;
    // look back 144 datapoints and get
    // the recent maximum value
    const lookback = 72;
    const percentDiff = 0.9;
    for (let i = 0; i < data.length; i++) {
      const previousValues = data.slice(Math.max(i - lookback, 0), i);
      const currentValue = data[i];

      let previousMaxValue: number;
      // Check if previousValues has any entries
      // prevents -infinity error
      if (previousValues.length > 0) {
        previousMaxValue = Math.max(...previousValues);
      } else {
        previousMaxValue = data[i];
      }

      // Compare currentValue to the maxValue relative to the
      // acceptable percent difference
      if (currentValue < previousMaxValue * percentDiff) {
        max = previousMaxValue;
        filteredData.push(max);
      } else {
        filteredData.push(currentValue);
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
  ): Promise<SeriesEntity[] | null> {
    const metricQuery = await this.metricQuery.get(name);

    const query = this.metricRepository
      .createQueryBuilder("m")
      .where("m.timestamp BETWEEN :to AND :from", {
        to,
        from,
      })
      .andWhere("m.metricQueryId = :metricQuery", {
        metricQuery: metricQuery.id,
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

    // Filter outliers and normalize the data
    const windowSize = 18;
    const filteredData = this.filterOutliers(data);
    const smoothedData = this.simpleMovingAverage(filteredData, windowSize);

    // Populate return object
    seriesData.push({
      timestamps: timestamps,
      data: smoothedData,
    });

    return seriesData;
  }

  // Returns the startdate of the metric being tracked from
  // the most recent value in the database
  async seedMetricStartDate(
    MetricQueryCreatedDate: Date,
    metricQueryId: number,
  ) {
    let startDate: number;

    // Fetch the metric's latest entry from the data points stored
    // in the metrics table
    let latestDate;
    try {
      latestDate = await this.metricRepository
        .createQueryBuilder("m")
        .where({ metricQueryId: metricQueryId })
        .orderBy("m.timestamp", "DESC")
        .getOne();
    } catch (error) {
      this.logger.debug(`Error in fetching latest date: ${error}`);
    }

    // Set timestamp from the most recent row, if exists
    const timestamp = latestDate?.timestamp || null;

    // Fetch the date stored in the metric query config table
    const startdate_timestamp = MetricQueryCreatedDate.getTime();
    const timestamp_formatted = new Date(timestamp).getTime();

    // Check if timestamp exists and is greater than the query creation date
    // This means data exists and should continue from the most recent point
    if (timestamp != null && timestamp_formatted > startdate_timestamp) {
      startDate = timestamp_formatted;
    } else {
      // If no timestamp exists, set timestamp to the metric query creation date
      // This should only occur if data is reset or no metric data exists for a new query
      startDate = startdate_timestamp;
    }

    return startDate;
  }

  public async save(entities: MetricEntity[]): Promise<void> {
    await this.metricRepository.save(entities);
  }

  async removeByMetricQueryName(name: string): Promise<void> {
    const metricQuery = await this.metricQuery.get(name);
    this.logger.debug(`Deleting metrics with name:  ${metricQuery.name}`);
    await this.metricRepository
      .createQueryBuilder()
      .delete()
      .from(MetricEntity)
      .where("metricQueryId = :id", { id: metricQuery.id })
      .execute();
  }
}
