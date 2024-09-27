import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { MigrationsService } from "../../../neighborhoods/migrations/migrations.service";
import { Repository } from "typeorm";
import { SchedulerConfigService } from "../../../config/scheduler/configuration.service";
import { Event } from "../../../database/entities/event.entity";
import { Neighborhood } from "../../../database/entities/neighborhood.entity";
import { TransactionDetails } from "../../../database/entities/transaction-details.entity";
import { Transaction } from "../../../database/entities/transaction.entity";
import { Migration } from "../../../database/entities/migration.entity";
import { BlockService } from "../../../neighborhoods/blocks/block.service";
import { EventsService } from "../../../neighborhoods/events/events.service";
import { TokensService } from "../../../neighborhoods/tokens/tokens.service";
import { NeighborhoodService } from "../../../neighborhoods/neighborhood.service";
import { TransactionsService } from "../../../neighborhoods/transactions/transactions.service";
import { getAllAddressesOf } from "../../../utils/cbor-parsers";
import { bufferToHex } from "../../../utils/convert";
import { getAnalyzerClass } from "../../../utils/protocol/attributes";
import { NetworkService, NetworkType } from "../../network.service";
import { MigrationAnalyzerService } from "../migration-analyzer.service";
import { TxAnalyzerService } from "../tx-analyzer.service";

@Injectable()
export class NeighborhoodUpdater {
  private logger: Logger;
  private n: Neighborhood;

  constructor(
    private schedulerConfig: SchedulerConfigService,
    private network: NetworkService,
    private neighborhood: NeighborhoodService,
    private block: BlockService,
    private transaction: TransactionsService,
    private events: EventsService,
    private tokens: TokensService,
    private migrations: MigrationsService,
    private txAnalyzer: TxAnalyzerService,
    private migrationAnalyzer: MigrationAnalyzerService,
    @InjectRepository(TransactionDetails)
    private txDetailsRepository: Repository<TransactionDetails>,
    @InjectRepository(Migration)
    private migrationRepository: Repository<Migration>,
  ) {}

  with(n: Neighborhood) {
    this.n = n;
    this.logger = new Logger(`${NeighborhoodUpdater.name}(${n.id})`);
    return this;
  }

  private async updateNeighborhoodMissingEvents(neighborhood: Neighborhood) {
    const latestEv = await this.events.latestEvent(neighborhood.id);

    const latestEventId = latestEv ? latestEv.eventId : new ArrayBuffer(0);

    const n = await this.network.forUrl(neighborhood.url);
    const events = await n.events.list(
      100,
      "ASC",
      // Lower bound on eventID exclusive.
      new Map([[3, new Map([[0, [1, latestEventId]]])]]),
    );
    this.logger.debug(`Got ${events.events.length} events for neighborhood ${neighborhood.name}`);

    await this.events.save(
      events.events.map((ev) => {
        const ne = new Event();

        ne.eventId = ev.id;
        ne.neighborhood = neighborhood;
        ne.timestamp = ev.time;
        ne.method = getAnalyzerClass(undefined, ev.type).method;
        ne.type = ev.type;
        ne.info = ev.info;
        ne.addresses = getAllAddressesOf(ev).map((x) => x.toString());

        return ne;
      }),
    );

  }

  private async updateNeighborhoodMissingTransactionDetails(
    neighborhood: Neighborhood,
  ) {
    const missingTxDetailsIds =
      await this.txAnalyzer.missingTransactionDetailsForNeighborhood(
        neighborhood,
      );

    if (missingTxDetailsIds.length === 0) {
      return;
    }

    const transactions: Transaction[] = await this.transaction.findManyByIds(
      neighborhood,
      missingTxDetailsIds,
    );

    this.logger.debug(
      `Updating transaction details for [${missingTxDetailsIds}]`,
    );
    for (const tx of transactions) {
      const details = await this.txAnalyzer.analyzeTransaction(tx);
      if (details) {
        await this.txDetailsRepository.upsert(details, ["transaction"]);
      }
    }
  }

  private async updateNeighborhoodMissingMigrations(
    neighborhood: Neighborhood,
  ) {

    // Find potential migrations for neighborhood
    const potentialMigrations = 
      await this.migrationAnalyzer.missingMigrationForNeighborhood(
        neighborhood,
      );

    // For each migration analyze and process up to 10 at a time
    const migrationQueue = potentialMigrations.slice(0, 10).map(tx => {
      this.logger.debug(`potentialMigration id for neighborhood (${neighborhood.id}): ${tx.transaction.id}`);
      return this.migrationAnalyzer.analyzeMigration(neighborhood, tx);
    });

    await Promise.all(migrationQueue);

    // For each migration analyze and process
    for (const tx of potentialMigrations) {
      this.logger.debug(`potentialMigration id for neighborhood (${neighborhood.id}): ${tx.transaction.id}`);
      return await this.migrationAnalyzer.analyzeMigration(neighborhood, tx);
    }
  }

  private async checkIfNeighborhoodHasBeenReset(neighborhood: Neighborhood) {
    const genesisHash = await this.block.getGenesisBlockHash(neighborhood);
    if (!genesisHash) {
      this.logger.warn("No genesis block from neighborhood. Will not remove.");
      return;
    }

    const block = await this.block.findOneByHeight(neighborhood.id, 1);

    if (!block || !block.hash) {
      return;
    }

    if (Buffer.from(genesisHash).compare(Buffer.from(block.hash)) == 0) {
      return;
    }

    this.logger.log("Neighborhood seems reset (genesis not same hash).");
    // Here, we're talking about different networks for sure. Recreate it
    // and the rest of the scheduler should take care of re-catching up.
    const n = await this.neighborhood.get(neighborhood.id);
    await this.neighborhood.resetNeighborhood(neighborhood.id, n);
  }

  private async updateNeighborhoodEarliestMissingBlocks(
    neighborhood: Neighborhood,
  ) {
    const network = await this.network.forUrl(neighborhood.url);
    const latestHeight = await this.block.getLatestHeightOf(neighborhood);
    const missingBlocks = await this.block.missingBlockHeightsForNeighborhood(
      neighborhood,
      latestHeight,
      this.schedulerConfig.maxBlocks,
    );

    if (missingBlocks.length == 0) {
      this.logger.debug("No new block to fetch");
      // Nothing to do, save some math.
      return;
    }

    // Split missing blocks into groups of parallel.
    // This zips up by parallel, so if blocks 1..20 are missing and parallel is
    // 5, then [1, 6, 11, 16] are going to be one batch, then [2, 7, 12, 17],
    // etc.
    // This does mean the blocks will be out of order in the database, but that
    // is not a big deal (and they would be out of order regardless if we did
    // 1..5, 6..10, etc as those would also be run in parallel).
    // There is an improvement here when we can get ranges of blocks at once,
    // but this requires some bug fixes in the backend.
    const parallel = this.schedulerConfig.parallel;
    const parallelSleep = this.schedulerConfig.parallelSleep;
    const schedule = [];
    for (let i = 0; i < missingBlocks.length; i += parallel) {
      schedule[schedule.length] = missingBlocks.slice(i, i + parallel);
    }

    for (const batch of schedule) {
      await Promise.all(
        batch.map(async (height) => {
          const blockInfo = await network.blockchain.blockByHeight(height);
          // this.logger.debug(`blockInfo: ${JSON.stringify(blockInfo)}`)
          await this.block.createFromManyBlock(neighborhood, blockInfo);
        }),
      );

      // Sleep a bit.
      await new Promise((res) => setTimeout(res, parallelSleep * 1000));
    }
    this.logger.debug(
      `Done ${missingBlocks.length} blocks ${missingBlocks[0]}..=${
        missingBlocks[missingBlocks.length - 1]
      }`,
    );
  }

  private async getNetworkType(neighborhoodType: string): Promise<NetworkType> {
    if (neighborhoodType.includes("many-ledger")) {
      return "ledger"
    } else if (neighborhoodType.includes("many-kvstore")) {
      return "kvstore"
    } else {
      return undefined
    }
  }

  private async updateNeighborhoodMissingTokens(
    neighborhood: Neighborhood,
    networkType?: string) {

    try { 
      const existingTokens = await this.tokens.getAllTokens(neighborhood);
      const network = await this.network.forUrl(neighborhood.url, networkType);
      const ledgerInfo = await network.ledger.info();

      this.logger.debug(`ledgerInfo: ${JSON.stringify(ledgerInfo)}`);

      // call .supply() for each token to get total supply
      for (const token of ledgerInfo.symbols) {
        this.logger.debug(`token: ${JSON.stringify(token)}`);

        const supply = await network.ledger.supply(token.address);
        this.logger.debug(`total supply: ${JSON.stringify(supply.supply.total)}`);
      }

      // Locate missing tokens 
      const missingTokens = ledgerInfo.symbols.filter(symbol => 
        !existingTokens.some(existingToken => existingToken.address.toString() === symbol.address)
      );

      this.logger.debug(`missingTokens: ${JSON.stringify(missingTokens)}`)

      // Create token entities for missing tokens
      if (missingTokens.length > 0) {
        this.logger.debug(
          `Adding ${missingTokens.length} tokens to neighborhood ${neighborhood.id}`,
        );
        for (const t of missingTokens) {
          await this.tokens.addToken(neighborhood, t);
        }
      }

    } catch (error) {
      this.logger.error(`Error: ${error.message}`);
    }
  }

  async run() {
    const n = this.n;

    // Retrieve network type
    const nType = await this.getNetworkType(n.serverName);

    // If we can't check if neighborhood has been reset, we probably won't be
    // able to check anything, so just skip blocks too.
    // try {
    //   await this.checkIfNeighborhoodHasBeenReset(n);
    //   await this.updateNeighborhoodEarliestMissingBlocks(n);
    //   await this.updateNeighborhoodMissingEvents(n);
    //   if (nType == "ledger") {
    //     await this.updateNeighborhoodMissingTokens(n, nType);
    //   }
    // } catch (e) {
    //   this.logger.log(
    //     `Error happened while updating neighborhood blocks for neighborhood ${n.id} ${n.name}:\n${e.stack}`,
    //   );
    // }

    try {
      await this.checkIfNeighborhoodHasBeenReset(n);
    } catch (e) {
      this.logger.error(
        `Error happened while checking if neighborhood has been reset for neighborhood ${n.id} ${n.name}:\n${e.stack}`,
      );
    }

    // If we can't check if neighborhood has been reset, we probably won't be
    // able to check anything, so just skip blocks too.
    try {
      await this.updateNeighborhoodEarliestMissingBlocks(n);
    } catch (e) {
      this.logger.error(
        `Error happened while updating neighborhood blocks for neighborhood ${n.id} ${n.name}:\n${e.stack}`,
      );
    }

    try {
      await this.updateNeighborhoodMissingEvents(n);
    } catch (e) {
      this.logger.error(
        `Error happened while updating neighborhood events for neighborhood ${n.id} ${n.name}:\n${e.stack}`,
      );
    }

    try {
      if (nType == "ledger") {
        await this.updateNeighborhoodMissingTokens(n, nType);
      }
    } catch (e) {
      this.logger.error(
        `Error happened while updating neighborhood tokens for neighborhood ${n.id} ${n.name}:\n${e.stack}`,
      );
    }

    // This can be done at all scheduled jobs. It shouldn't take long, and
    // does not require network access so even if above fails, this should work.
    try {
      await this.updateNeighborhoodMissingTransactionDetails(n);
    } catch (e) {
      this.logger.error(
        `Error happened while updating transaction details:\n${e.stack}`,
      );
    }

    if (nType == "ledger") {
      try {
        await this.updateNeighborhoodMissingMigrations(n);
      } catch (e) {
        this.logger.error(
          `Error happened while updating migration details:\n${e.stack}`,
        );
      }
    }
  }
}
