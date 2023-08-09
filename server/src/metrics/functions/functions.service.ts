import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Metric as MetricEntity } from "../../database/entities/metric.entity";
import { PrometheusQueryService } from "../prometheus-query/query.service";

@Injectable()
export class FunctionsService {
  private readonly logger = new Logger(FunctionsService.name);

  constructor(
    @InjectRepository(MetricEntity)
    private metricRepository: Repository<MetricEntity>,
    private prometheusQuery: PrometheusQueryService,
  ) {}

  async get(name: string): Promise<MetricEntity | null> {
    const query = this.metricRepository
      .createQueryBuilder("n")
      .where({ name: name })
      .where("n.name = :name", {
        name: name,
      })
      .limit(1);

    const one = await query.getOne();

    if (!one) {
      return null;
    }

    return one;
  }

  // Get the current value for a metric
  async getSum(name: string): Promise<number> {
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

    return sum;
  }
}
