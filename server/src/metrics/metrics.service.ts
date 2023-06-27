import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from "nestjs-typeorm-paginate";

import { DataSource, Repository, LessThan, MoreThan } from "typeorm";
import { Metric as MetricEntity } from "../database/entities/metric.entity";
import { PrometheusQueryService } from "./prometheus-query/query.service";
import { MetricsSchedulerConfigService } from "../config/metrics-scheduler/configuration.service";

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

  async getSeries(
    name: string,
    from: Date,
    to: Date,
  ): Promise<MetricEntity[] | null> {
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

    const one = await query.getMany();

    if (!one) {
      return null;
    }

    return await query.getMany();
  }

  async seedMetricStartDate(prometheusQueryId: number) {
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
    const startdate_timestamp = new Date(
      this.schedulerConfig.startdate_timestamp,
    ).getTime();
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
