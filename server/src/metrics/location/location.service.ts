import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateLocationDto } from "../../dto/location.dto";
import { Location } from "../../database/entities/location.entity";

@Injectable()
export class LocationService {
  private readonly logger = new Logger(LocationService.name);

  constructor(
    @InjectRepository(Location)
    private locationRepository: Repository<Location>,
  ) {}

  findAll(): Promise<Location[]> {
    return this.locationRepository.find();
  }

  async get(name: string): Promise<Location | null> {
    const query = this.locationRepository
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

  async create(dto: CreateLocationDto): Promise<Location> {
    const entity = Location.createWithDto(dto);
    await this.locationRepository.save([entity]);

    return entity;
  }

  async update(
    id: number,
    updateQueryDto: Partial<CreateLocationDto>,
  ): Promise<Location> {
    const query = await this.locationRepository.findOne({ where: { id } });

    if (!query) {
      return undefined;
    }

    Object.assign(query, updateQueryDto);
    return this.locationRepository.save(query);
  }

  async removeById(id: number): Promise<void> {
    await this.locationRepository.delete({ id });
  }

  public async save(entities: Location[]): Promise<void> {
    await this.locationRepository.save(entities);
  }
}
