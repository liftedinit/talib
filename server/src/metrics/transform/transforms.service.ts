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

    // Use DOUBLE PRECISION to match JS Number() behavior exactly
    const result = await this.metricRepository
      .createQueryBuilder("m")
      .select("SUM(m.data::DOUBLE PRECISION)", "sum")
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

    // Compute cumulative sum on ALL data, then filter
    // Uses DOUBLE PRECISION to match JS Number() behavior exactly
    // Subquery computes cumulative on full dataset, outer query filters
    // Original logic: keep timestamps >= to (slice before first timestamp < to)
    const result = await this.dataSource.query(
      `SELECT timestamp, cumulative
       FROM (
         SELECT
           timestamp,
           SUM(data::DOUBLE PRECISION) OVER (ORDER BY timestamp ASC) as cumulative
         FROM metric
         WHERE "prometheusQueryId" = $1
       ) sub
       WHERE timestamp >= $2
       ORDER BY timestamp DESC`,
      [prometheusQuery.id, to]
    );

    if (!result || result.length === 0) {
      return null;
    }

    return [{
      timestamps: result.map(r => r.timestamp),
      data: result.map(r => Number(r.cumulative)),
    }];
  }
}
