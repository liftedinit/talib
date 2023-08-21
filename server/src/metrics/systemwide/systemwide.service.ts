import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { Metric as MetricEntity } from "../../database/entities/metric.entity";
import { Block as BlockEntity } from "../../database/entities/block.entity";
import { SeriesEntity } from "../metrics.service";
import { Transaction as TransactionEntity } from "../../database/entities/transaction.entity";

type Current = {
  id: number;
  timestamp: string;
  data: string;
};

export type Blocks = {
  neighborhoodId: string;
  highest_value: number;
};

@Injectable()
export class SystemWideService {
  private readonly logger = new Logger(SystemWideService.name);

  constructor(
    @InjectRepository(MetricEntity)
    private metricRepository: Repository<MetricEntity>,
    @InjectRepository(BlockEntity)
    private blockRepository: Repository<BlockEntity>,
    @InjectRepository(TransactionEntity)
    private transactionRepository: Repository<TransactionEntity>,
    private dataSource: DataSource,
  ) {}

  // Get the total blocks produced from all networks
  async getTotalBlocks(): Promise<Current> {
    const query = `
      SELECT "neighborhoodId", MAX(height) AS highest_value
      FROM block
      GROUP BY "neighborhoodId"
    `;

    const values = await this.dataSource.query(query);

    if (!values) {
      return null;
    }

    const blocksum = values.reduce(
      (accumulator, item) => accumulator + Number(item.highest_value),
      0,
    );

    this.logger.debug(`Total blocks: ${blocksum}`);

    const sumTotal = {
      id: Math.floor(Math.random() * 900000) + 100000,
      timestamp: new Date().toISOString(),
      data: blocksum,
    };

    return sumTotal;
  }

  // Get the total transactions from all networks
  async getTotalTransactions(): Promise<Current> {
    const query = this.transactionRepository
      .createQueryBuilder("t")
      .select("COUNT(t.id)", "count");

    const transactions = await query.getRawOne();

    this.logger.debug(`Total transactions: ${transactions.count}`);

    if (!transactions) {
      return null;
    }

    const transactionsTotal = {
      id: Math.floor(Math.random() * 900000) + 100000,
      timestamp: new Date().toISOString(),
      data: transactions.count,
    };

    return transactionsTotal;
  }
}
