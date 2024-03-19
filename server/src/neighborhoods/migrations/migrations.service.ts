import { 
  Injectable, 
  Logger,
  NotFoundException
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from "nestjs-typeorm-paginate";
import { Repository, DataSource } from "typeorm";
import { Block } from "../../database/entities/block.entity";
import { Migration } from "../../database/entities/migration.entity";
import { Migration as MigrationEntity } from "../../database/entities/migration.entity";
import { MigrationDto, UpdateMigrationDto } from "../../dto/migration.dto";

@Injectable()
export class MigrationsService {
  private readonly logger = new Logger(MigrationsService.name);

  constructor(
    @InjectRepository(MigrationEntity)
    private migrationRepository: Repository<MigrationEntity>,
    private datasource: DataSource,
  ) {}

  async findOneByUuid(
    neighborhoodId: number,
    uuid: string,
  ): Promise<MigrationDto | null> {

    if (!uuid) {
      throw new Error('UUID is undefined');
    }

    let migrationQuery = this.migrationRepository
      .createQueryBuilder("m")
      .select(["m"])
      .where("m.uuid = :uuid", { uuid })
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

  public async updateOneByUuid(
    neighborhoodId: number,
    uuid: string,
    updateMigrationDto: Partial<UpdateMigrationDto>
  ): Promise<MigrationDto> {
    const queryRunner = this.datasource.createQueryRunner();

    try {
      // Start transaction
      await queryRunner.startTransaction();
  
      // Acquire pessimistic write lock
      const lockedMigration = await queryRunner.manager
        .createQueryBuilder()
        .setLock('pessimistic_write')
        .setOnLocked("nowait")
        .select()
        .from(Migration, 'm')
        .where('uuid = :uuid', { uuid })
        .innerJoin("m.transaction", "t")
        .innerJoin(Block, 'b', 'b.id = t.blockId AND b.neighborhoodId = :neighborhoodId', { neighborhoodId: neighborhoodId })
        .execute()

      // Verify lock was obtained
      const affectedRows = lockedMigration.length ?? 0;
      if (affectedRows === 0) {
        throw new Error(`Could not acquire lock for migration with UUID ${uuid}`);
      }
  
      // Update the locked row
      this.logger.debug("Updating locked migration row with UUID ${uuid}.")
      await queryRunner.manager.update(Migration, { uuid: uuid }, updateMigrationDto);
  
      // Commit the transaction, release the lock
      await queryRunner.commitTransaction();
  
      // Fetch the updated migration outside of the transaction with lock release
      const updatedMigration = await this.migrationRepository.findOne({ where: { uuid } });
  
      return updatedMigration.intoDto();
    } catch (error) {
      // Rollback the transaction in case of an error
      await queryRunner.rollbackTransaction();
      this.logger.debug(`Error during saveAndLockMigration: ${error.message}`);
      throw error;
    } finally {
      // Release the query runner
      await queryRunner.release();
    }
  }

}
