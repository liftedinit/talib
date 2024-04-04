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
import { Repository, DataSource, In } from "typeorm";
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

  public async claimMany(
    neighborhoodId: number,
    limit: number,
  ): Promise<MigrationDto[]> {
    const queryRunner = this.datasource.createQueryRunner();
    let updatedMigrations = [];

    try {
      await queryRunner.startTransaction();

      const lockedMigration = await queryRunner.manager
        .createQueryBuilder()
        .setLock('pessimistic_write')
        .setOnLocked('skip_locked')
        .limit(limit) // Limit the number of rows to claim
        .select()
        .from(Migration, 'm')
        .where('m.status = 1') // Created
        .innerJoin("m.transaction", "t")
        .innerJoin(Block, 'b', 'b.id = t.blockId AND b.neighborhoodId = :neighborhoodId', { neighborhoodId: neighborhoodId })
        .execute()

       let updatedMigrationsUuid = [];
      // Claim all affected rows
      for (const migration of lockedMigration) {
        await queryRunner.manager.update(Migration, { uuid: migration.uuid }, { status: 2 }); // Claimed
        updatedMigrationsUuid.push(migration.uuid);
      }

      // Commit the transaction, release the lock
      await queryRunner.commitTransaction();

      // Fetch and return the updated migrations
      if (updatedMigrationsUuid.length > 0) {
        updatedMigrations = await this.migrationRepository.findBy({ uuid: In(updatedMigrationsUuid) });
        updatedMigrations = updatedMigrations.map((m) => m.intoDto());
      }
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.debug(`Error during saveAndLockMigration: ${error.message}`);
      throw error;

    } finally {
      await queryRunner.release();
    }

    return updatedMigrations
  }

  public async claimOneByUuid(
    neighborhoodId: number,
    uuid: string,
    force: boolean = false
  ): Promise<MigrationDto> {
    const queryRunner = this.datasource.createQueryRunner();

    try {
      // Start transaction
      await queryRunner.startTransaction();

      // Acquire pessimistic write lock
      let lockedMigrationQuery = queryRunner.manager
        .createQueryBuilder()
        .setLock('pessimistic_write')
        .select()
        .limit(1)
        .from(Migration, 'm')
        .where('uuid = :uuid', { uuid })
        .innerJoin("m.transaction", "t")
        .innerJoin(Block, 'b', 'b.id = t.blockId AND b.neighborhoodId = :neighborhoodId', { neighborhoodId: neighborhoodId })

      // If force is false, only claim migrations that are in the Created status
      if (!force) {
        lockedMigrationQuery = lockedMigrationQuery.andWhere('status = 1') // Created
      }

      const lockedMigration = await lockedMigrationQuery.execute()

      // Verify lock was obtained
      const affectedRows = lockedMigration.length ?? 0;
      if (affectedRows === 0) {
        return null
      }

      // Update the locked row
      await queryRunner.manager.update(Migration, { uuid: uuid }, { status: 2, error: undefined }); // Claimed

      // Commit the transaction, release the lock
      await queryRunner.commitTransaction();

      // Fetch the updated migration outside the transaction with lock release
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
        .select()
        .from(Migration, 'm')
        .where('uuid = :uuid', { uuid })
        .andWhere("status != " + updateMigrationDto.status)
        .innerJoin("m.transaction", "t")
        .innerJoin(Block, 'b', 'b.id = t.blockId AND b.neighborhoodId = :neighborhoodId', { neighborhoodId: neighborhoodId })
        .execute()

      // Verify lock was obtained
      const affectedRows = lockedMigration.length ?? 0;
      if (affectedRows === 0) {
        return null
      }

      // Update the locked row
      await queryRunner.manager.update(Migration, { uuid: uuid }, updateMigrationDto);
  
      // Commit the transaction, release the lock
      await queryRunner.commitTransaction();
  
      // Fetch the updated migration outside the transaction with lock release
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
