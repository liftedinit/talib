import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from "nestjs-typeorm-paginate";

import { Repository } from "typeorm";
import { Metric as MetricEntity } from "../database/entities/metric.entity";
import { PrometheusQueryDetailsService } from "./prometheus-query-details/query-details.service";

@Injectable()
export class MetricsService {
  private readonly logger = new Logger(MetricsService.name);

  constructor(
    @InjectRepository(MetricEntity)
    private metricRepository: Repository<MetricEntity>,
    // private prometheusQueryDetails: PrometheusQueryDetailsService,
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
      .where("m.prometheusQueryId = :pid", { pid: prometheusQueryId })
      .orderBy("m.metricId", "DESC");

    this.logger.debug(`findMany(${prometheusQueryId}: ${query.getQuery()}`);
    return await paginate(query, options);
  }

  public async latestMetric(
    prometheusQueryId: number,
  ): Promise<MetricEntity | null> {
    const query = this.metricRepository
      .createQueryBuilder("m")
      .where({ neighborhood: { id: prometheusQueryId } })
      .orderBy("m.id", "DESC")
      .limit(1);

    this.logger.debug(
      `prometheusQueryId(${prometheusQueryId}: ${query.getQuery()}`,
    );

    // // Query prometheus
    // const latestMetric =
    //   this.prometheusQueryDetails.getPrometheusQueryCurrentValue(
    //     prometheusQuery,
    //   );

    return await query.getOne();
  }

  public async save(entities: MetricEntity[]): Promise<void> {
    await this.metricRepository.save(entities);
  }
}
