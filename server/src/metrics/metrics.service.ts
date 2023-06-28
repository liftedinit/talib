import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from "nestjs-typeorm-paginate";

import { DataSource, Repository } from "typeorm";
import { Metric as MetricEntity } from "../database/entities/metric.entity";
import { PrometheusQueryService } from "./prometheus-query/query.service";
import { MetricsSchedulerConfigService } from "../config/metrics-scheduler/configuration.service";

export type SeriesEntity = {
  data: number[] | string[];
  timestamps: Date[];
};

@Injectable()
export class MetricsService {
  private readonly logger = new Logger(MetricsService.name);

  constructor(
    @InjectRepository(MetricEntity)
    private metricRepository: Repository<MetricEntity>,
    private dataSource: DataSource,
    private prometheusQuery: PrometheusQueryService,
    private schedulerConfig: MetricsSchedulerConfigService,
  ) {}

  findAll(): Promise<MetricEntity[]> {
    return this.metricRepository.find();
  }

  public async findMany(
    prometheusQueryId: number,
    options: IPaginationOptions,
  ): Promise<Pagination<MetricEntity>> {
    const query = this.metricRepository
      .createQueryBuilder("m")
      .where("m.prometheusQueryName = :name", { name: prometheusQueryId })
      .orderBy("m.timestamp", "DESC")
      .limit(500);

    return await paginate(query, options);
  }

  async getCurrent(name: string): Promise<MetricEntity | null> {
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
  }

  // Moving averages
  normalizeData(inputArray: number[], windowSize: number): number[] {
    // Create an empty array to store the smoothed values
    const smoothedArray: number[] = [];

    // Calculate the offset based on the window size
    const offset = Math.floor(windowSize / 2);

    // Loop through each element in the input array
    for (let i = 0; i < inputArray.length; i++) {
      let sum = 0;
      let count = 0;

      // Calculate the average of the values within the window
      for (let j = i - offset; j <= i + offset; j++) {
        if (j >= 0 && j < inputArray.length) {
          sum += inputArray[j];
          count++;
        }
      }

      // Calculate the average and add it to the smoothed array
      const average = sum / count;
      smoothedArray.push(average);
    }

    // Return the smoothed array
    return smoothedArray;
  }

  // Lookback and remove the 95th percentile of outliers
  filterOutliers(data: number[]): number[] {
    const filteredData: number[] = [];

    let max = 0;
    // 144 datapoints prior
    const lookback = 72;
    for (let i = 0; i < data.length; i++) {
      const previousValues = data.slice(Math.max(i - lookback, 0), i);
      const currentValue = data[i];

      let previousMaxValue: number;
      if (previousValues.length > 0) {
        previousMaxValue = Math.max(...previousValues);
      } else {
        previousMaxValue = data[i];
      }

      if (currentValue < previousMaxValue * 0.95) {
        max = previousMaxValue;
        filteredData.push(max);
      } else {
        filteredData.push(currentValue);
      }
    }

    return filteredData;
  }

  async getSeries(
    name: string,
    from: Date,
    to: Date,
  ): Promise<SeriesEntity[] | null> {
    this.logger.debug(`Name:  ${name}`);
    const prometheusQuery = await this.prometheusQuery.get(name);

    const query = this.metricRepository
      .createQueryBuilder("m")
      .where("m.timestamp BETWEEN :to AND :from", {
        to,
        from,
      })
      .andWhere("m.prometheusQueryId = :prometheusQuery", {
        prometheusQuery: prometheusQuery.id,
      })
      .orderBy("m.timestamp", "DESC");

    const result: MetricEntity[] | null = await query.getMany();
    const seriesData: SeriesEntity[] = [];
    const data: number[] = [];
    const timestamps: Date[] = [];

    result.forEach((series) => {
      data.push(Number(series.data));
      timestamps.push(series.timestamp);
    });

    const windowSize = 12;
    const filteredData = this.filterOutliers(data);
    const smoothedData = this.normalizeData(filteredData, windowSize);

    seriesData.push({
      timestamps: timestamps,
      data: smoothedData,
      // data: data,
    });

    // this.logger.debug(`nonFiltereddata: ${data}`);
    // this.logger.debug(`filtereDdata: ${this.filterOutliers(data)}`);

    return seriesData;
  }

  async seedMetricStartDate(
    PrometheusQueryCreatedDate: Date,
    prometheusQueryId: number,
  ) {
    let startDate: number;
    // const latestDate = this.metricRepository
    //   .createQueryBuilder("m")
    //   .where({ prometheusQueryId: prometheusQueryId })
    //   .orderBy("m.timestamp", "DESC");

    let latestDate;
    try {
      latestDate = await this.metricRepository
        .createQueryBuilder("m")
        .where({ prometheusQueryId: prometheusQueryId })
        .orderBy("m.timestamp", "DESC")
        .getOne();
    } catch (error) {
      // handle the error here, for example:
      this.logger.debug(`Error in fetching latest date: ${error}`);
    }

    // const metricOne = latestDate;
    const timestamp = latestDate?.timestamp || null;
    const startdate_timestamp = PrometheusQueryCreatedDate.getTime();
    const timestamp_formatted = new Date(timestamp).getTime();

    if (timestamp != null && timestamp_formatted > startdate_timestamp) {
      startDate = timestamp_formatted;
    } else {
      startDate = startdate_timestamp;
    }

    return startDate;
  }

  public async save(entities: MetricEntity[]): Promise<void> {
    await this.metricRepository.save(entities);
  }
}
