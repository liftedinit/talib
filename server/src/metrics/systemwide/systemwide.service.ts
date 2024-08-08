import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { SystemWideMetric as SystemWideEntity } from "../../database/entities/systemwide-metric.entity";
import { CreateSystemWideMetricDto } from "../../dto/systemwide-metric.dto";
import { DataSource, Repository } from "typeorm";
import { Transaction as TransactionEntity } from "../../database/entities/transaction.entity";
import { FindOneOptions } from 'typeorm';
import { create } from "axios";

type Current = {
  name: string;
  timestamp: string;
  data: string;
};

export type Blocks = {
  neighborhoodId: string;
  highest_value: number;
};

export type SystemWideMetricType = {
  name: string; 
  query: string;
}

@Injectable()
export class SystemWideService {
  private readonly logger = new Logger(SystemWideService.name);

  constructor(
    @InjectRepository(TransactionEntity)
    private transactionRepository: Repository<TransactionEntity>,
    @InjectRepository(SystemWideEntity)
    private systemWideMetricRepository: Repository<SystemWideEntity>,
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

    const sumTotal = {
      name: "totalblocks",
      timestamp: new Date().toISOString(),
      data: blocksum,
    };

    return sumTotal;
  }

  // Get the total addresses produced from all networks
  async getTotalAddresses(): Promise<Current> { 
    const query = `
    SELECT COUNT(DISTINCT address) AS unique_addresses_count
    FROM (
      SELECT json_data.argument->>'address' AS address
      FROM public.transaction_details AS json_data
      
      UNION
      
      SELECT json_data.argument->>'account' AS address
      FROM public.transaction_details AS json_data
      
      UNION
      
      SELECT json_data.argument->>'from' AS address
      FROM public.transaction_details AS json_data
    ) AS addresses
    WHERE address IS NOT NULL
    `;

    const values = await this.dataSource.query(query);

    if (!values) {
      return null;
    }

    const addressesTotal = {
      name: "totaladdresses",
      timestamp: new Date().toISOString(),
      data: values[0].unique_addresses_count,
    };

    return addressesTotal;
  }

  // Get the total transactions from all networks
  async getTotalTransactions(): Promise<Current> {
    const query = this.transactionRepository
      .createQueryBuilder("t")
      .select("COUNT(t.id)", "count");

    const transactions = await query.getRawOne();

    if (!transactions) {
      return null;
    }

    const transactionsTotal = {
      name: "totaltransactions",
      timestamp: new Date().toISOString(),
      data: transactions.count,
    };

    return transactionsTotal;
  }

  // Get a SystemWideMetric from the database
  async getCurrent(name: string): Promise<SystemWideEntity>{

    const q = await this.systemWideMetricRepository.createQueryBuilder("b")
    .where("b.name = :name", { name })

    const values = await q.getOne();

    if (!values) {
      return null;
    }

    return values;
  }

  // Save a single SystemWideMetric to the database
  private async seedSystemWideMetricValue(metric) {
    this.logger.debug(`seeding system wide metric: ${metric.name}`);

    const metricValue = await this[metric.query]();

    const existingEntity = await this.systemWideMetricRepository.findOne({
      where: { name: metric.name } as FindOneOptions<SystemWideMetricType>['where'],
    });

    let entity: SystemWideEntity;

    if (existingEntity) {
      // If entity with the same name exists, update it by setting the new values
      let updateSystemWideMetricDto: Partial<CreateSystemWideMetricDto>

      updateSystemWideMetricDto = {
        name: metric.name,
        timestamp: new Date(metricValue.timestamp),
        data: metricValue.data,
      };

      Object.assign(existingEntity, updateSystemWideMetricDto);

      return await this.systemWideMetricRepository.save(existingEntity);

    } else {
      // If entity doesn't exist, create a new one
      entity = new SystemWideEntity();

      entity.name = metric.name;
      entity.timestamp = new Date(metricValue.timestamp);
      entity.data = metricValue.data;

      this.logger.debug(`seeding system wide metric: ${entity.name}`);

      return await this.systemWideMetricRepository.save(entity);
    }
  }

  // Seed all SystemWideMetrics into the database
  private async seedSystemWideMetrics(
    metrics: SystemWideMetricType[]
    ) {
    for (let i = 0; i < metrics.length; i++) {
      try {
        await this.seedSystemWideMetricValue(metrics[i]);
      } catch (err) {
        this.logger.error(`Error during seeding systemwide metric: ${err}`);
      }
      
    }
  }

  // Update all SystemWideMetrics
  async updateSystemWideMetrics() {

    this.logger.debug(`updating system wide metrics`);

    const systemWideMetrics: SystemWideMetricType[] = [
      {name: 'totalblocks', query: 'getTotalBlocks'},
      {name: 'totaltransactions', query: 'getTotalTransactions'},
      {name: 'totaladdresses', query: 'getTotalAddresses'},
    ]

    await this.seedSystemWideMetrics(systemWideMetrics);
  }

}
