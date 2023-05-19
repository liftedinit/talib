import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateMetricDto } from "../dto/metric.dto";
import { Metric } from "../database/entities/metric.entity";
import { MetricDetails } from "../database/entities/metric-details.entity";

@Injectable()
export class MetricService {
  private readonly logger = new Logger(MetricService.name);

  constructor(
    @InjectRepository(Metric)
    private metricRepository: Repository<Metric>,
    @InjectRepository(MetricDetails)
    private metricDetailsRepository: Repository<MetricDetails>,
  ) {}

  findAll(): Promise<Metric[]> {
    return this.metricRepository.find();
  }

  async get(name: string): Promise<Metric | null> {
    const query = this.metricRepository
      .createQueryBuilder("n")
      .where({ name: name })
      .groupBy("n.id")
      .limit(1);

    this.logger.debug(`get(${name}): \`${query.getQuery()}\``);

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

  public async save(entities: Metric[]): Promise<void> {
    await this.metricRepository.save(entities);
  }
}
