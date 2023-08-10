import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Metric as MetricEntity } from "../../database/entities/metric.entity";
import { PrometheusQueryService } from "../prometheus-query/query.service";
import { SeriesEntity } from "../metrics.service";

type Current = {
  id: number;
  timestamp: string;
  data: string;
};

@Injectable()
export class TransformsService {
  private readonly logger = new Logger(TransformsService.name);

  constructor(
    @InjectRepository(MetricEntity)
    private metricRepository: Repository<MetricEntity>,
    private prometheusQuery: PrometheusQueryService,
  ) {}

  // Get the current value for a metric
  async getSumTotal(name: string): Promise<Current> {
    const prometheusQuery = await this.prometheusQuery.get(name);

    const query = this.metricRepository
      .createQueryBuilder("m")
      .where("m.prometheusQueryId = :prometheusQuery", {
        prometheusQuery: prometheusQuery.id,
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
    const prometheusQuery = await this.prometheusQuery.get(name);

    const query = this.metricRepository
      .createQueryBuilder("m")
      .where("m.prometheusQueryId = :prometheusQuery", {
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

    // Reformat the data to be a sum of previous values at each timestamp
    for (let i = data.length - 1; i >= 0; i--) {
      if (i < data.length - 1) {
        data[i] = data[i] + data[i + 1];
      }
    }

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
