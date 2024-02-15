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
    ): Promise<number[]> {

      // @TODO get list of all transaction ids from known migrations


      // Check for missing migrations for neighborhood
      // @TODO filter out transactions that are already in migrations table 
      const query = await this.txDetailsRepository
        .createQueryBuilder('td')
        .select(["td.id", "td.argument", "t.id"])
        .where('td.argument ->> \'memo\' ILIKE \'\%UUID\%\'')
        // .innerJoin(Transaction, 't', 't.id = td.transactionId')
        .innerJoinAndSelect('td.transaction', 't')
        .innerJoin(Block, 'b', 'b.id = t.blockId AND b.neighborhoodId = :neighborhoodId', { neighborhoodId: neighborhood.id });

      const results = await query.getMany();
      this.logger.debug(`Missing Migrations for neighborhood (${neighborhood.id}): ${JSON.stringify(results)}`);

      // @TODO filter out UUID fron transaction data

      return (results.map((x) => x.transaction.id));

      // @TODO compare entries in migrations table to potential results of migrations filtering
    }

  async analyzeMigrationImpl(
    transaction: Transaction,
  ): Promise<Migration | null> {
    if (!transaction.id) {
      // If the transaction is null, something went wrong already. Don't bother
      // parsing.
      return null;
    }

    try {
      const migrationEntity = new Migration();
      migrationEntity.transaction = transaction 
      migrationEntity.hash = transaction.hash;

      //@TODO - save migrationEntity.uuid with transaction.argument.memo/UUID 

      return migrationEntity;
    } catch (e) {
      this.logger.debug(`Error during saving : ${e}`);
    }
  } 

  async analyzeMigration(
    transaction: Transaction,
  ): Promise<Migration | null> {
    try {
      return await this.analyzeMigrationImpl(transaction);
    } catch (e) {
      this.logger.debug(`MigrationAnalyzer error: ${e}`)
      throw new Error(
        `${e}\nContext: id = ${transaction.id}, hash = "${bufferToHex(transaction.hash)}"`,
      );
    }
  }

  async saveAndLockMigration(migration: Migration) {
    this.logger.debug(
      `Save & lock migration for initial save: ${JSON.stringify(bufferToHex(migration.transaction.hash))}`
      )

    // @TODO lock entry in migration table
    await this.migrationRepository.save(migration);
  }
}
