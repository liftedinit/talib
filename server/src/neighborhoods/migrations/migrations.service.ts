import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from "nestjs-typeorm-paginate";
import { Repository } from "typeorm";
import { Block } from "../../database/entities/block.entity";
import { Migration } from "../../database/entities/migration.entity";
import { Migration as MigrationEntity } from "../../database/entities/migration.entity";
import { MigrationDto } from "../../dto/migration.dto";

@Injectable()
export class MigrationsService {
  private readonly logger = new Logger(MigrationsService.name);

  constructor(
    @InjectRepository(MigrationEntity)
    private migrationRepository: Repository<MigrationEntity>,
  ) {}

  async findMigrationByUUID(
    hash: ArrayBuffer,
  ): Promise<MigrationEntity | null> {
    let query = this.migrationRepository
      .createQueryBuilder("t")
      .where("t.hash = :hash", { hash })
    
    return await query.getOne();
  }

  async findOneByHash(
    neighborhoodId: number,
    hash: ArrayBuffer,
  ): Promise<MigrationDto | null> {

    if (!hash) {
      throw new Error('Hash is undefined');
    }

    let migrationQuery = this.migrationRepository
      .createQueryBuilder("m")
      .select(["m"])
      .where("m.manyHash = :hash", { hash })
      .innerJoin("m.transaction", "t")
      .innerJoin(Block, 'b', 'b.id = t.blockId AND b.neighborhoodId = :neighborhoodId', { neighborhoodId: neighborhoodId })

    const migration = await migrationQuery.getOne()
    this.logger.debug(`migration query: ${JSON.stringify(migration)}`)

    if (!migration) {
      return null;
    }

    return migration.intoDto();
  }

  public async findMany(
    neighborhoodId: number,
    status: number,
    options: IPaginationOptions,
  ): Promise<Pagination<Migration>> {
    
    let query = this.migrationRepository
      .createQueryBuilder("m")
      .select(["m"])
      .innerJoin("m.transaction", "t")
      .innerJoin(Block, 'b', 'b.id = t.blockId AND b.neighborhoodId = :neighborhoodId', { neighborhoodId: neighborhoodId });

    if (status) {
      query = query.andWhere("m.status = :status", { status });
    }

    return await paginate<Migration>(query, options);
  }

  // @TODO update on migration entry by UUID
  // async updateOneByUUID

  // @TODO (maybe) update on migration entry by hash
  // async updateOneByHash 

}
