import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import {
  IPaginationOptions,
  paginateRaw,
  Pagination,
} from "nestjs-typeorm-paginate";
import { DataSource, Repository, SelectQueryBuilder } from "typeorm";
import { Block } from "../../database/entities/block.entity";
import { Neighborhood } from "../../database/entities/neighborhood.entity";
import { TransactionDetails } from "../../database/entities/transaction-details.entity";
import { Transaction } from "../../database/entities/transaction.entity";
import { BlockDto } from "../../dto/block.dto";
import { NetworkService } from "../../services/network.service";
import { TxAnalyzerService } from "../../services/scheduler/tx-analyzer.service";
import { bufferToHex } from "../../utils/convert";
import {
  Block as ManyBlock,
  Transaction as ManyTransaction,
} from "../../utils/network/blockchain";

interface FindOneOptions {
  details?: boolean;
}

@Injectable()
export class BlockService {
  private readonly logger = new Logger(BlockService.name);

  constructor(
    @InjectRepository(Block)
    private blockRepository: Repository<Block>,
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    private network: NetworkService,
    private dataSource: DataSource,
    private analyzer: TxAnalyzerService,
  ) {}

  addTransactions(q: SelectQueryBuilder<any>) {
    return q
      .leftJoinAndMapMany(
        "b.transactions",
        "transaction",
        "t",
        `"t"."blockId" = "b"."id"`,
      )
      .leftJoinAndMapOne(
        "t.details",
        TransactionDetails,
        "details",
        `"details"."transactionId" = "t"."id"`,
      );
  }

  async findOneByHeight(
    nid: number,
    height: number,
    options: FindOneOptions = {},
  ): Promise<Block | null> {
    let q = this.blockRepository
      .createQueryBuilder("b")
      .where("b.neighborhoodId = :nid", { nid })
      .andWhere("b.height = :height", { height });
    if (options.details) {
      q = this.addTransactions(q);
    }

    this.logger.debug(`findOneByHeight(${nid}, ${height}): ${q.getQuery()}`);
    return q.getOne();
  }

  async findOneByHash(
    nid: number,
    hash: ArrayBuffer,
    options: FindOneOptions = {},
  ): Promise<Block> {
    let q = this.blockRepository
      .createQueryBuilder("b")
      .where("b.neighborhoodId = :nid", { nid })
      .andWhere("b.hash = :hash", { hash });
    if (options.details) {
      q = this.addTransactions(q);
    }

    this.logger.debug(`findOneByHash(${nid}, ${bufferToHex(hash)}): `);
    return q.getOne();
  }

  public async findManyDto(
    neighborhoodId: number,
    options: IPaginationOptions,
  ): Promise<Pagination<BlockDto>> {
    const driver = this.blockRepository.manager.connection.driver;
    const metadata = this.blockRepository.metadata;
    const timeColumnMetadata = metadata.ownColumns.find(
      (x) => x.propertyName == "time",
    );

    const query = this.dataSource
      .createQueryBuilder()
      .select("b.height", "height")
      // In PostGres if we don't ask for the specific type we get an incorrect
      // string and won't format the field properly on the output.
      .addSelect("b.time::timestamptz", "time")
      .addSelect("b.hash", "hash")
      .addSelect("b.appHash", "appHash")
      .addSelect("COUNT(transactions.id)", "txCount")
      .from("block", "b")
      .leftJoin("b.transactions", "transactions")
      .where('b."neighborhoodId" = :nid', { nid: neighborhoodId })
      .groupBy(`height, time, b.hash, b."appHash"`)
      .orderBy("height", "DESC");
    const countQuery = this.blockRepository
      .createQueryBuilder("b")
      .select("MAX(height) as height")
      .where({ neighborhood: { id: neighborhoodId } });

    this.logger.debug(`findMany(${neighborhoodId}): ${query.getQuery()}`);

    const totalItems = (await countQuery.getRawOne<{ height: number }>())
      .height;

    const results = await paginateRaw(query, {
      ...options,
      countQueries: false,
    });
    return {
      ...results,
      items: results.items.map((x) => ({
        height: x.height,
        dateTime: driver
          .prepareHydratedValue(x.time, timeColumnMetadata)
          .toISOString(),
        appHash: bufferToHex(x.appHash),
        blockHash: bufferToHex(x.hash),
        txCount: Number(x.txCount) || 0,
      })),
      meta: {
        ...results.meta,
        totalItems,
        totalPages: Math.ceil(totalItems / +options.limit),
      },
    };
  }

  async getLatestHeightFetched(
    neighborhood: Neighborhood,
  ): Promise<number | null> {
    const blocks = await this.findManyDto(neighborhood.id, {
      limit: 1,
      page: 1,
    });
    const last = blocks[0]; // Ordered by height descending.
    return last?.height;
  }

  async getLatestHeightOf(neighborhood: Neighborhood): Promise<number> {
    const n = await this.network.forUrl(neighborhood.url);
    const info = await n.blockchain.info();
    return info.latestBlock.height;
  }

  async getGenesisBlockHash(
    neighborhood: Neighborhood,
  ): Promise<ArrayBuffer | null> {
    const n = await this.network.forUrl(neighborhood.url);
    const blockInfo = await n.blockchain.blockByHeight(1);
    return blockInfo?.identifier.hash;
  }

  private missingBlockHeightsQueryForPostgres(
    neighborhood: Neighborhood,
    latestHeight: number,
    max?: number,
  ) {
    // Optimized: find gaps using window functions, only generate_series for gaps
    // Much faster than generate_series(1, millions) EXCEPT
    return `
      WITH existing AS (
        SELECT height, LEAD(height) OVER (ORDER BY height) as next_height
        FROM block
        WHERE "neighborhoodId" = ${neighborhood.id}
      ),
      max_existing AS (
        SELECT COALESCE(MAX(height), 0) as max_h FROM block WHERE "neighborhoodId" = ${neighborhood.id}
      ),
      gap_ranges AS (
        -- Gaps between existing blocks
        SELECT height + 1 as gap_start, next_height - 1 as gap_end
        FROM existing
        WHERE next_height IS NOT NULL AND next_height > height + 1
        UNION ALL
        -- Starting gap (if blocks don't start at 1)
        SELECT 1 as gap_start, MIN(height) - 1 as gap_end
        FROM block WHERE "neighborhoodId" = ${neighborhood.id}
        HAVING MIN(height) > 1
        UNION ALL
        -- Ending gap (new blocks at the end)
        SELECT max_h + 1 as gap_start, ${latestHeight} as gap_end
        FROM max_existing
        WHERE max_h < ${latestHeight}
      )
      SELECT generate_series(gap_start, gap_end) as missnum
      FROM gap_ranges
      WHERE gap_end >= gap_start
      ORDER BY missnum
      ${max !== undefined ? "LIMIT " + max : ""}
    `;
  }

  async missingBlockHeightsForNeighborhood(
    neighborhood: Neighborhood,
    maxHeight: number,
    count = 500,
  ): Promise<number[]> {
    const query = this.missingBlockHeightsQueryForPostgres(
      neighborhood,
      maxHeight,
      count,
    );

    const result = await this.dataSource.query(query);
    return result.map((r) => Number(r.missnum)) as number[];
  }

  async createFromManyBlock(neighborhood: Neighborhood, block: ManyBlock) {
    const entity = new Block();
    entity.appHash = block.appHash;
    entity.height = block.identifier.height;
    entity.hash = block.identifier.hash;
    entity.time = block.time;
    entity.neighborhood = neighborhood;

    const transactions = await Promise.all(
      block.transactions.map(async (tx, i) => {
        const transaction = new Transaction();
        transaction.block = entity;
        transaction.hash = tx.hash;
        transaction.block_index = i;

        // Try to populate request/response, but save tx even if it fails
        try {
          await this.populateTransaction(neighborhood, entity, tx);
          transaction.request = tx.request;
          transaction.response = tx.response;
        } catch (e) {
          // Save with null request/response - updateNeighborhoodMissingTransactionDetails will retry
          this.logger.warn(`Failed to populate transaction ${i} in block ${block.identifier.height}, will retry later: ${e.message}`);
        }

        return transaction;
      }),
    );
    entity.transactions = transactions;

    const result = await this.blockRepository.save(entity);
    if (transactions.length > 0) {
      await this.transactionRepository.save(transactions);
    }
    return result;
  }

  async populateTransaction(
    neighborhood: Neighborhood,
    block: Block,
    tx: ManyTransaction,
  ): Promise<ManyTransaction> {
    const n = await this.network.forUrl(neighborhood.url);
    const [request, response] = await Promise.all([
      tx.request ?? n.blockchain.request(tx.hash),
      tx.response ?? n.blockchain.response(tx.hash),
    ]);

    tx.request = request;
    tx.response = response;
    return tx;
  }
}
