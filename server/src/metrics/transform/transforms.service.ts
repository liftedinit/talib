import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { Metric as MetricEntity } from "../../database/entities/metric.entity";
import { Block as BlockEntity } from "../../database/entities/block.entity";
import { PrometheusQueryService } from "../prometheus-query/query.service";
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
    private prometheusQuery: PrometheusQueryService,
  ) {}

  // Get the current value for a metric
  async getSumTotal(name: string): Promise<Current> {
    const prometheusQuery = await this.prometheusQuery.get(name);

    const result = await this.metricRepository
      .createQueryBuilder("m")
      .select("SUM(CAST(m.data AS NUMERIC))", "sum")
      .where("m.prometheusQueryId = :prometheusQuery", {
        prometheusQuery: prometheusQuery.id,
      })
      .getRawOne();

    if (!result || result.sum === null) {
      return null;
    }

    return {
      id: Math.floor(Math.random() * 900000) + 100000,
      timestamp: new Date().toISOString(),
      data: result.sum.toString(),
    };
  }

  async getSeriesSumTotal(
    name: string,
    from: Date,
    to: Date,
  ): Promise<SeriesEntity[] | null> {
    const prometheusQuery = await this.prometheusQuery.get(name);

    // Filter by date range in SQL, not in JS
    const result: MetricEntity[] = await this.metricRepository
      .createQueryBuilder("m")
      .where("m.prometheusQueryId = :prometheusQuery", {
        prometheusQuery: prometheusQuery.id,
      })
      .andWhere("m.timestamp >= :from", { from })
      .andWhere("m.timestamp < :to", { to })
      .orderBy("m.timestamp", "DESC")
      .getMany();

    if (!result || result.length === 0) {
      return null;
    }

    const data: number[] = [];
    const timestamps: Date[] = [];

    result.forEach((series) => {
      data.push(Number(series.data));
      timestamps.push(series.timestamp);
    });

    // Cumulative sum from right to left
    for (let i = data.length - 2; i >= 0; i--) {
      data[i] = data[i] + data[i + 1];
    }

    return [{
      timestamps,
      data,
    }];
  }
}
