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

    // Compute cumulative sum in DB using window function
    // Uses DOUBLE PRECISION to match JS Number() behavior exactly
    const result = await this.metricRepository
      .createQueryBuilder("m")
      .select("m.timestamp", "timestamp")
      .addSelect(
        "SUM(m.data::DOUBLE PRECISION) OVER (ORDER BY m.timestamp ASC)",
        "cumulative"
      )
      .where("m.prometheusQueryId = :id", { id: prometheusQuery.id })
      .andWhere("m.timestamp < :to", { to })
      .orderBy("m.timestamp", "DESC")
      .getRawMany();

    if (!result || result.length === 0) {
      return null;
    }

    return [{
      timestamps: result.map(r => r.timestamp),
      data: result.map(r => Number(r.cumulative)),
    }];
  }
}
