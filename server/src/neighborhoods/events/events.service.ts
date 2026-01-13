import { Address } from "@liftedinit/many-js";
import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from "nestjs-typeorm-paginate";
import { Brackets, DataSource, Repository } from "typeorm";
import { Event as EventEntity } from "../../database/entities/event.entity";

@Injectable()
export class EventsService {
  private readonly logger = new Logger(EventsService.name);

  constructor(
    @InjectRepository(EventEntity)
    private eventRepository: Repository<EventEntity>,
    private dataSource: DataSource,
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
    if (entities.length === 0) return;

    // Use transaction to ensure all-or-nothing save (no gaps on partial failure)
    await this.dataSource.transaction(async (manager) => {
      await manager.save(EventEntity, entities);
    });
  }

  async findWithAddress(
    nid: number,
    address: Address,
    options: IPaginationOptions,
  ): Promise<Pagination<EventEntity>> {
    const query = this.eventRepository
      .createQueryBuilder("e")
      .select()
      .where("e.neighborhoodId = :nid", { nid })
      .andWhere(
        new Brackets((qb) => {
          qb.where(":address = ANY(e.addresses)", {
            address: address.toString(),
          });
          qb.orWhere("e.info::json->'amounts'->>:address IS NOT NULL", {
            address: address.toString(),
          });
        }),
      )
      .addOrderBy("e.eventId", "DESC");

    this.logger.debug(`getMany(${nid}, ${address}): ${query.getQuery()}`);
    return await paginate(query, options);
  }
}
