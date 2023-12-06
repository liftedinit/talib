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

  // Seed all SystemWideMetrics into the database
  private async seedSystemWideMetricValues(
    metrics: SystemWideMetricType[]
    ) {
    for (let i = 0; i < metrics.length; i++) {
      this.logger.debug(`seeding system wide metric: ${metrics[i].name}`);
      const metric = metrics[i];
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

      } else {
        // If entity doesn't exist, create a new one
        entity = new SystemWideEntity();

        entity.name = metric.name;
        entity.timestamp = new Date(metricValue.timestamp);
        entity.data = metricValue.data;
    
        await this.systemWideMetricRepository.save(entity);
      }
    }
  }

  // Update all SystemWideMetrics
  async updateSystemWideMetrics() {
    const systemWideMetrics: SystemWideMetricType[] = [
      {name: 'totalblocks', query: 'getTotalBlocks'},
      {name: 'totaltransactions', query: 'getTotalTransactions'}
    ]

    await this.seedSystemWideMetricValues(systemWideMetrics);
  }

}
