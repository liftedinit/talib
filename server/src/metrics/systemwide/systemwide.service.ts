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

  // Get the current value for a metric
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

  async seedTotalBlocks(): Promise<void> {
    const query = `
    SELECT 
        "neighborhoodId",
        DATE_TRUNC('hour', "time") + 
            ((EXTRACT(MINUTE FROM "time") / 10)::int * 10 || ' minutes')::interval AS time_interval,
        SUM(height) AS total_height
    FROM block
    GROUP BY 
        "neighborhoodId",
        DATE_TRUNC('hour', "time") + 
            ((EXTRACT(MINUTE FROM "time") / 10)::int * 10 || ' minutes')::interval
    ORDER BY 
        "neighborhoodId",
        time_interval;
    `;

    const values = await this.dataSource.query(query);

    return null;
  }

  async getTotalBlocksSeries(
    from: Date,
    to: Date,
  ): Promise<SeriesEntity[] | null> {
    const query = `
    SELECT 
        "neighborhoodId",
        DATE_TRUNC('hour', "time") + 
            ((EXTRACT(MINUTE FROM "time") / 10)::int * 10 || ' minutes')::interval AS time_interval,
        SUM(height) AS total_height
    FROM block
    GROUP BY 
        "neighborhoodId",
        DATE_TRUNC('hour', "time") + 
            ((EXTRACT(MINUTE FROM "time") / 10)::int * 10 || ' minutes')::interval
    ORDER BY 
        "neighborhoodId",
        time_interval;
    `;

    const values = await this.dataSource.query(query);

    if (!values) {
      return null;
    }

    // this.logger.debug(`Total blocks series: ${JSON.stringify(values)}`);

    // Initialize arrays for data processing
    const seriesData: SeriesEntity[] = [];
    const data: number[] = values.map((value) => ({
      ...value,
      value: Number(value.total_height),
    }));
    const timestamps: Date[] = values.map(
      (value) => new Date(value.time_interval),
    );

    this.logger.debug(`data: ${JSON.stringify(data)}`);
    this.logger.debug(`timestamps: ${JSON.stringify(timestamps)}`);

    // Find the index of the first timestamp that is before the "to" date
    const filterStartIndex = timestamps.findIndex(
      (timestamp) => new Date(timestamp) < to,
    );

    // Filter data based on a range of timestamps
    const filteredData = data.slice(0, filterStartIndex);
    const filteredTimestamps = timestamps.slice(0, filterStartIndex);

    // Populate return object with filtered data
    seriesData.push({
      timestamps: filteredTimestamps,
      data: filteredData,
    });

    return seriesData;
  }

  // Get the current value for a metric
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
