import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Neighborhood } from "../../database/entities/neighborhood.entity";
import { TransactionDetails } from "../../database/entities/transaction-details.entity";
import { Transaction } from "../../database/entities/transaction.entity";
import { Block } from "../../database/entities/block.entity";
import { Migration } from "../../database/entities/migration.entity";
import { bufferToHex } from "../../utils/convert";
import { TransactionsService } from "../../neighborhoods/transactions/transactions.service";
import { Argument } from "../../dto/migration.dto";


@Injectable()
export class MigrationAnalyzerService {
  private readonly logger = new Logger(MigrationAnalyzerService.name);

  constructor(
    private transactions: TransactionsService,
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    @InjectRepository(TransactionDetails)
    private txDetailsRepository: Repository<TransactionDetails>,
    @InjectRepository(Migration)
    private migrationRepository: Repository<Migration>,
  ) {}

  async missingMigrationForNeighborhood(
    neighborhood: Neighborhood,
    ): Promise<TransactionDetails[]> {


      // Filter out transactions that are already in migrations table 
      const subQuery = this.migrationRepository
      .createQueryBuilder('m')
      .select('1')
      .where('m.transactionId = t.id');

      // Check for missing migrations for neighborhood
      const query = await this.txDetailsRepository
        .createQueryBuilder('td')
        .select(["td.id", "td.argument", "t.id"])
        .where("td.argument ->> 'memo' ~* '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}'")
        .andWhere("td.error IS NULL")
        .andWhere("td.method = 'ledger.send'")
        .innerJoinAndSelect('td.transaction', 't')
        .innerJoin(Block, 'b', 'b.id = t.blockId AND b.neighborhoodId = :neighborhoodId', { neighborhoodId: neighborhood.id })
        .andWhere(`NOT EXISTS (${subQuery.getQuery()})`);

      // Set params of main query to be the same as sub query
      query.setParameters(subQuery.getParameters());

      const results = await query.getMany();

      return results;
    }

    async analyzeMigration(
      neighborhood: Neighborhood,
      transaction: TransactionDetails,
    ): Promise<Migration | null> {
      try {
        return await this.analyzeMigrationImpl(neighborhood, transaction);
      } catch (e) {
        this.logger.debug(`MigrationAnalyzer error: ${e}`)
        if (transaction) {
          throw new Error(
            `${e}\nContext: id = ${transaction.transaction.id}, hash = "${bufferToHex(transaction.hash)}"`,
          );
        }
      }
    }

  async analyzeMigrationImpl(
    neighborhood: Neighborhood,
    transactionDetails: TransactionDetails,
  ): Promise<Migration | null> {

    if (!transactionDetails) {
      // If the transaction is null, something went wrong already. Don't bother
      // parsing.
      this.logger.debug(`No transaction found with migration details.`)
      return null;
    }

    const existingMigration = await this.migrationRepository.findOne({ 
      where: { transaction: transactionDetails.transaction }});

    if (existingMigration) {
      this.logger.debug(`Migration with transaction ${JSON.stringify(transactionDetails.transaction.id)} already exists. Skipping...`);
      return existingMigration;
    }

    // @TODO - check that destination address of transaction was maiyg anonymous address

    try {

      // Create the migration 
      const migrationEntity = new Migration();

      const argument = transactionDetails.argument;
      this.logger.debug(`transaction argument: ${JSON.stringify(argument)}`);

      const uuid = (argument as Argument).memo[0];
      const manifestaddress = (argument as Argument).memo[1]
      migrationEntity.createdDate = new Date();
      migrationEntity.transaction = transactionDetails.transaction;
      migrationEntity.details = transactionDetails;
      migrationEntity.manyHash = transactionDetails.transaction.hash;
      migrationEntity.uuid = uuid;
      migrationEntity.status = 1;

      // Return null for debug
      // return null

      return this.saveAndLockMigration(migrationEntity);
    } catch (e) {
      this.logger.debug(`Error during saving migration: ${e}`);
    }
  } 

  async saveAndLockMigration(migration: Migration) {
    this.logger.debug(
      `Save & lock migration for initial save: ${JSON.stringify(bufferToHex(migration.transaction.hash))}`
      )

    // @TODO - check if UUID is already in migrations table
    // @TODO - save transaction id and UUID in migrations table
    // @TODO - lock entry in migrations table

    // @TODO lock entry in migration table
    return await this.migrationRepository.save(migration);
  }
}
