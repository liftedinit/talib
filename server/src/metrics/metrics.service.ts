import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from "nestjs-typeorm-paginate";

import { Repository, LessThan, MoreThan } from "typeorm";
import { Metric as MetricEntity } from "../database/entities/metric.entity";
import { PrometheusQueryDetailsService } from "./prometheus-query-details/query-details.service";
import { PrometheusQueryService } from "./prometheus-query/query.service";
import { PrometheusQuery } from "src/database/entities/prometheus-query.entity";

@Injectable()
export class MetricsService {
  private readonly logger = new Logger(MetricsService.name);

  constructor(
    @InjectRepository(MetricEntity)
    private metricRepository: Repository<MetricEntity>,
    private prometheusQuery: PrometheusQueryService,
    // @InjectRepository(PrometheusQuery)
    // private prometheusQueryRepository: Repository<PrometheusQuery>,
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
      .where("m.prometheusQueryName = :name", { name: prometheusQueryId })
      .orderBy("m.timestamp", "DESC")
      .limit(500);

    this.logger.debug(`findMany(${prometheusQueryId}: ${query.getQuery()}`);
    return await paginate(query, options);
  }

  async getCurrent(name: string): Promise<MetricEntity | null> {
    const prometheusQuery = await this.prometheusQuery.get(name);

    this.logger.debug(`prometheusQueryCurrent ${prometheusQuery.id}`);

    const query = this.metricRepository
      .createQueryBuilder("m")
      .where("m.prometheusQueryId = :prometheusQuery", {
        prometheusQuery: prometheusQuery.id,
      })
      .orderBy("m.timestamp", "DESC")
      .limit(1);

    this.logger.debug(`getCurrent(${name}): \`${query.getQuery()}\``);

    const one = await query.getOne();

    if (!one) {
      return null;
    }

    return one;
  }

  async getSeries(
    name: string,
    from: Date,
    to: Date,
  ): Promise<MetricEntity[] | null> {
    const prometheusQuery = await this.prometheusQuery.get(name);

    this.logger.debug(`prometheusQuerySeries ${prometheusQuery.id}`);

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

    this.logger.debug(`getSeries(${name}): \`${query.getMany()}\``);

    const one = await query.getMany();

    if (!one) {
      return null;
    }

    return await query.getMany();
  }

  public async save(entities: MetricEntity[]): Promise<void> {
    await this.metricRepository.save(entities);
  }
}
