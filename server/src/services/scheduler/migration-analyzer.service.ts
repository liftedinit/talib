import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Neighborhood } from "../../database/entities/neighborhood.entity";
import { TransactionDetails } from "../../database/entities/transaction-details.entity";
import { Transaction } from "../../database/entities/transaction.entity";
import { Block } from "../../database/entities/block.entity";
import { Migration } from "../../database/entities/migration.entity";
import { CreateMigrationDto } from "../../dto/migration.dto";
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

      const uuidPattern = '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}';
      const illegalAddress = 'maiyg'

      // Filter out transactions that are already in migrations table 
      const subQuery = this.migrationRepository
      .createQueryBuilder('m')
      .select('1')
      .where('m.transactionId = t.id');

      // Check for missing migrations for neighborhood
      const query = this.txDetailsRepository
        .createQueryBuilder('td')
        .select(["td.id", "td.argument", "t.id"])
        .where("td.argument ->> 'to' = :illegalAddress") // The migration destination address is the illeral address
        .andWhere("td.argument ->> 'memo' ~* :uuidPattern") // The migration transaction has a memo that is a UUID
        .andWhere("td.error IS NULL")
        .andWhere("td.method = 'ledger.send'")
        .innerJoinAndSelect('td.transaction', 't')
        .innerJoin(Block, 'b', 'b.id = t.blockId AND b.neighborhoodId = :neighborhoodId', { neighborhoodId: neighborhood.id })
        .andWhere(`NOT EXISTS (${subQuery.getQuery()})`);

      // Set params of main query to be the same as sub query
      query.setParameters({...subQuery.getParameters(), uuidPattern, illegalAddress });

      const results = await query.getMany();

      this.logger.debug(`Missing migrations for neighborhood ${JSON.stringify(results)}`)

      // Subquery to get multisigExecute transactions matching the token of a multisigSubmit transaction
      const multisigExecSubQuery = this.txDetailsRepository
        .createQueryBuilder('td2')
        .select('1')
        .where("td2.method = 'account.multisigExecute'")
        .andWhere("td2.error IS NULL")
        .andWhere("td.result->>'token' = td2.argument->>'token'") // Match the token of the multisig submit transaction with the token of the multisig execute transaction
        .andWhere("td2.transactionId != td.transactionId") // Exclude the same transaction

      // Get executed multisig transactions
      const multisigQuery = this.txDetailsRepository
        .createQueryBuilder('td')
        .select(["td.id", "td.argument", "td.result"])
        .where("td.argument -> 'transaction' -> 'argument' ->> 'to' = :illegalAddress") // The migration destination address the illegal address (inner transaction)
        .andWhere("td.argument -> 'transaction' ->> 'method' = 'ledger.send'") // The migration inner transaction is a ledger send
        .andWhere("td.argument -> 'transaction' -> 'argument' ->> 'memo' ~* :uuidPattern") // The migration inner transaction has a memo that is a UUID
        .andWhere("td.argument ->> 'memo' ~* :uuidPattern") // The multisig submit transaction has a memo that is a UUID
        .andWhere("td.error IS NULL")
        .andWhere("td.method = 'account.multisigSubmitTransaction'")
        .innerJoinAndSelect('td.transaction', 't')
        .innerJoin(Block, 'b', 'b.id = t.blockId AND b.neighborhoodId = :neighborhoodId', { neighborhoodId: neighborhood.id })
        .andWhere(`EXISTS (${multisigExecSubQuery.getQuery()})`) // Return only transactions that have a corresponding multisigExecute transaction that matches the multisig submit token
        .andWhere(`NOT EXISTS (${subQuery.getQuery()})`);

      multisigQuery.setParameters({ ...subQuery.getParameters(),
        ...multisigExecSubQuery.getParameters(),
        uuidPattern,
        illegalAddress});

      const r2 = await multisigQuery.getMany();

      this.logger.debug(`Missing migrations for neighborhood (multisig) ${JSON.stringify(r2)}`)

      // Append the results of the second query to the first query
      results.push(...r2);

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

    try {

      // Create the migration 
      const migrationEntity = new Migration();

      const argument = transactionDetails.argument;
      this.logger.debug(`transaction argument: ${JSON.stringify(argument)}`);

      const uuid = (argument as Argument).memo[0];
      const manifestaddress = (argument as Argument).memo[1]

      migrationEntity.status = 1;
      migrationEntity.createdDate = new Date();
      migrationEntity.uuid = uuid;
      migrationEntity.transaction = transactionDetails.transaction;
      migrationEntity.details = transactionDetails;
      migrationEntity.manyHash = transactionDetails.transaction.hash;
      migrationEntity.manifestAddress = manifestaddress;

      // Create a CreateMigrationDto instance from the migration entity
      const createMigrationDto = migrationEntity.createDto();

      // Enforce CreateMigrationDto object on create
      if (createMigrationDto instanceof CreateMigrationDto) {
        return this.saveAndLockMigration(migrationEntity);
      } else {
        this.logger.debug(`Migration entity does not conform to CreateMigrationDto`)
      }
    } catch (e) {
      this.logger.debug(`Error during saving migration: ${e}`);
    }
    
  }

  async saveAndLockMigration(migration: Migration) {
    this.logger.debug(
      `Save & lock migration for initial save: ${JSON.stringify(bufferToHex(migration.transaction.hash))}`
      )

    try {
      this.logger.debug(`Saving entity ${JSON.stringify(migration)}`)

      return await this.migrationRepository.save(migration);
    } catch (e) {
      this.logger.error(`Error during saving migration entity: ${e}}`)
      return e
    }
  
  }
}
