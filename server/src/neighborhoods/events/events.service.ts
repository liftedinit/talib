import { Address } from "@liftedinit/many-js";
import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from "nestjs-typeorm-paginate";
import { Brackets, Repository } from "typeorm";
import { Event as EventEntity } from "../../database/entities/event.entity";

@Injectable()
export class EventsService {
  private readonly logger = new Logger(EventsService.name);

  constructor(
    @InjectRepository(EventEntity)
    private eventRepository: Repository<EventEntity>,
  ) {}

  public async findMany(
    neighborhoodId: number,
    options: IPaginationOptions,
  ): Promise<Pagination<EventEntity>> {
    const query = this.eventRepository
      .createQueryBuilder("e")
      .where("e.neighborhoodId = :nid", { nid: neighborhoodId })
      .orderBy("e.eventId", "DESC");

    this.logger.debug(`findMany(${neighborhoodId}: ${query.getQuery()}`);
    return await paginate(query, options);
  }

  public async latestEvent(
    neighborhoodId: number,
  ): Promise<EventEntity | null> {
    const query = this.eventRepository
      .createQueryBuilder("e")
      .where({ neighborhood: { id: neighborhoodId } })
      .orderBy("e.id", "DESC")
      .limit(1);

    this.logger.debug(`latestEvent(${neighborhoodId}: ${query.getQuery()}`);
    return await query.getOne();
  }

  public async save(entities: EventEntity[]): Promise<void> {
    await this.eventRepository.save(entities);
  }

  async findWithAddress(
    nid: number,
    address: Address,
    options: IPaginationOptions,
  ): Promise<Pagination<EventEntity>> {
    const query = this.eventRepository
      .createQueryBuilder("e")
      // .distinct(true)
      .select()
      .where("e.neighborhoodId = :nid", { nid })
      .orWhere(
        new Brackets((qb) => {
          qb.where(":address = ANY(e.addresses)", {
            address: address.toString(),
          });
        }),
      )
      .orWhere(
        new Brackets((qb) => {
          qb.where("e.info LIKE :address", {
            address: address.toString(),
          });
        }),
      )
      .addOrderBy("e.eventId", "DESC");

    this.logger.debug(`getMany(${nid}, ${address}): ${query.getQuery()}`);
    return await paginate(query, options);
  }
}
