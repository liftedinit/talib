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

  async getCurrent(name: string): Promise<MetricEntity | null> {
    const query = this.metricRepository
      .createQueryBuilder("n")
      .where({ name: name })
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
  ): Promise<MetricEntity | null> {
    const query = this.metricRepository
      .createQueryBuilder("m")
      .where({ name: name })
      .where("m.timestamp BETWEEN :to AND :from", {
        to,
        from,
      })
      .orderBy("m.timestamp", "DESC");
    // .limit(1);
    this.logger.debug(`getPrevious(${name}): \`${query.getQuery()}\``);

    const one = await query.getOne();

    if (!one) {
      return null;
    }

    return one;
  }

  public async save(entities: MetricEntity[]): Promise<void> {
    await this.metricRepository.save(entities);
  }
}
