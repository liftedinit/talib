import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from "nestjs-typeorm-paginate";
import { DataSource, Repository } from "typeorm";
import { Neighborhood } from "../../database/entities/neighborhood.entity";
import { Block } from "../../database/entities/block.entity";
import { TransactionDetails } from "../../database/entities/transaction-details.entity";
import { Transaction } from "../../database/entities/transaction.entity";
import { Migration } from "../../database/entities/migration.entity";
import { NetworkService } from "../../services/network.service";

@Injectable()
export class MigrationsService {
  constructor(
    @InjectRepository(Transaction)
    private migrationRepository: Repository<Migration>,
    private network: NetworkService,
    private dataSource: DataSource,
  ) {}

  async findMigrationByUUID(
    hash: ArrayBuffer,
  ): Promise<Migration | null> {
    let query = this.migrationRepository
      .createQueryBuilder("t")
      .where("t.hash = :hash", { hash })
    
    return await query.getOne();
  }

  async findOneByHash(
    neighborhoodId: number,
    hash: ArrayBuffer,
    details = false,
  ): Promise<Migration | null> {
    let query = this.migrationRepository
      .createQueryBuilder("t")
      .where("t.hash = :hash", { hash })
      .leftJoinAndSelect("t.block", "block")
      .andWhere("block.neighborhoodId = :nid", { nid: neighborhoodId })
      .addOrderBy("block.height", "DESC");

    if (details) {
      query = query.innerJoinAndMapOne(
        "t.details",
        TransactionDetails,
        "details",
        `"details"."transactionId" = t.id`,
      );
    }
    return await query.getOne();
  }

  // @TODO - Find many with pagination options
  // public async findMany(
  //   neighborhoodId: number,
  //   options: IPaginationOptions,
  // ): Promise<Pagination<Migration>> {
  //   let query = this.migrationRepository
  //     .createQueryBuilder("m")
  //     .select()
  //     .innerJoin(Block, 'b', 'b.id = t.blockId AND b.neighborhoodId = :neighborhoodId', { neighborhoodId: neighborhoodId });

  //   return await paginate<Migration>(query, options);
  // }

  // @TODO update on migration entry by UUID
  // async updateOneByUUID

  // @TODO (maybe) update on migration entry by hash
  // async updateOneByHash 

}
