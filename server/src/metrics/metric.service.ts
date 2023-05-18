import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateMetricDto } from "../dto/metric.dto";
import { Metric } from "../database/entities/metric.entity";

@Injectable()
export class MetricService {
  private readonly logger = new Logger(MetricService.name);

  constructor(
    @InjectRepository(Metric)
    private metricRepository: Repository<Metric>,
  ) {}

  findAll(): Promise<Metric[]> {
    return this.metricRepository.find();
  }

  async get(nid: number): Promise<Metric | null> {
    const query = this.metricRepository
      .createQueryBuilder("n")
      .where({ id: nid })
      .groupBy("n.id")
      .limit(1);

    this.logger.debug(`get(${nid}): \`${query.getQuery()}\``);

    const one = await query.getOne();

    if (!one) {
      return null;
    }

    return one;
  }

  async create(dto: CreateMetricDto): Promise<Metric> {
    const entity = Metric.createWithDto(dto);
    await this.metricRepository.save([entity]);

    return entity;
  }

  async removeById(id: number): Promise<void> {
    await this.metricRepository.delete({ id });
  }
}
