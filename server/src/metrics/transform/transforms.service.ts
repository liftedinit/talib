import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { Metric as MetricEntity } from "../../database/entities/metric.entity";
import { Block as BlockEntity } from "../../database/entities/block.entity";
import { MetricQueryService } from "../metric-query/query.service";
import { SeriesEntity } from "../metrics.service";

type Current = {
  id: number;
  timestamp: string;
  data: string;
};

export type Blocks = {
  neighborhoodId: string;
  highest_value: number;
};

@Injectable()
export class TransformsService {
  private readonly logger = new Logger(TransformsService.name);

  constructor(
    @InjectRepository(MetricEntity)
    private metricRepository: Repository<MetricEntity>,
    @InjectRepository(BlockEntity)
    private blockRepository: Repository<BlockEntity>,
    private dataSource: DataSource,
    private metricQuery: MetricQueryService,
  ) {}

  // Get the current value for a metric
  async getSumTotal(name: string): Promise<Current> {
    const metricQuery = await this.metricQuery.get(name);

    const query = this.metricRepository
      .createQueryBuilder("m")
      .where("m.metricQueryId = :metricQuery", {
        metricQuery: metricQuery.id,
      })
      .orderBy("m.timestamp", "DESC");

    const values: MetricEntity[] = await query.getMany();

    if (!values) {
      return null;
    }

    const sum = values.reduce(
      (accumulator, item) => accumulator + Number(item.data),
      0,
    );

    const sumTotal = {
      id: Math.floor(Math.random() * 900000) + 100000,
      timestamp: new Date().toISOString(),
      data: sum.toString(),
    };

    return sumTotal;
  }

  async getSeriesSumTotal(
    name: string,
    from: Date,
    to: Date,
  ): Promise<SeriesEntity[] | null> {
    const metricQuery = await this.metricQuery.get(name);

    // Get all values for a metric from the database from all time
    const query = this.metricRepository
      .createQueryBuilder("m")
      .where("m.metricQueryId = :metricQuery", {
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

    // Generate the cumulative sum of the data and insert it into the data array
    data.reduceRight((accumulator, currentValue, currentIndex) => {
      data[currentIndex] = accumulator + currentValue;
      return data[currentIndex];
    });

    // Find the index of the first timestamp that is before the "to" date
    const filterStartIndex = timestamps.findIndex(
      (timestamp) => new Date(timestamp) < to,
    );

    // Filter data based on a range of timestamps
    const filteredData = data.slice(0, filterStartIndex);
    const filteredTimestamps = timestamps.slice(0, filterStartIndex);

    // Populate return object with filtered data
    seriesData.push({
      timestamps: filteredTimestamps,
      data: filteredData,
    });

    return seriesData;
  }
}
