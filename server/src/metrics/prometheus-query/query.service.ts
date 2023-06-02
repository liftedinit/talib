import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreatePrometheusQueryDto } from "../../dto/prometheus-query.dto";
import { PrometheusQuery } from "../../database/entities/prometheus-query.entity";

@Injectable()
export class PrometheusQueryService {
  private readonly logger = new Logger(PrometheusQueryService.name);

  constructor(
    @InjectRepository(PrometheusQuery)
    private metricRepository: Repository<PrometheusQuery>,
  ) {}

  findAll(): Promise<PrometheusQuery[]> {
    return this.metricRepository.find();
  }

  async get(name: string): Promise<PrometheusQuery | null> {
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

  async create(dto: CreatePrometheusQueryDto): Promise<PrometheusQuery> {
    const entity = PrometheusQuery.createWithDto(dto);
    await this.metricRepository.save([entity]);

    return entity;
  }

  async removeById(id: number): Promise<void> {
    await this.metricRepository.delete({ id });
  }

  public async save(entities: PrometheusQuery[]): Promise<void> {
    await this.metricRepository.save(entities);
  }
}
