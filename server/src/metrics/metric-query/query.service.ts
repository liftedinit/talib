import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateMetricQueryDto } from "../../dto/metric-query.dto";
import { MetricQuery } from "../../database/entities/metric-query.entity";

@Injectable()
export class MetricQueryService {
  private readonly logger = new Logger(MetricQueryService.name);

  constructor(
    @InjectRepository(MetricQuery)
    private metricRepository: Repository<MetricQuery>,
  ) {}

  findAll(): Promise<MetricQuery[]> {
    return this.metricRepository.find();
  }

  async get(name: string): Promise<MetricQuery | null> {
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

  async create(dto: CreateMetricQueryDto): Promise<MetricQuery> {
    const entity = MetricQuery.createWithDto(dto);
    await this.metricRepository.save([entity]);

    return entity;
  }

  async removeById(id: number): Promise<void> {
    await this.metricRepository.delete({ id });
  }

  public async save(entities: MetricQuery[]): Promise<void> {
    await this.metricRepository.save(entities);
  }
}
