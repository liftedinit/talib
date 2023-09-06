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

  async create(dto: CreatePrometheusQueryDto): Promise<PrometheusQuery> {
    const entity = PrometheusQuery.createWithDto(dto);
    await this.metricRepository.save([entity]);

    return entity;
  }

  async update(
    id: number,
    updateQueryDto: Partial<CreatePrometheusQueryDto>,
  ): Promise<PrometheusQuery> {
    const query = await this.metricRepository.findOne({ where: { id } });

    if (!query) {
      return undefined;
    }

    Object.assign(query, updateQueryDto); // Merge the changes from updateUserDto into the user entity
    return this.metricRepository.save(query); // Save the updated user to the database
  }

  async removeById(id: number): Promise<void> {
    await this.metricRepository.delete({ id });
  }

  public async save(entities: PrometheusQuery[]): Promise<void> {
    await this.metricRepository.save(entities);
  }
}
