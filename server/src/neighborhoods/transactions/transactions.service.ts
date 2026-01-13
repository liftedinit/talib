import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from "nestjs-typeorm-paginate";
import { DataSource, Repository } from "typeorm";
import { Neighborhood } from "../../database/entities/neighborhood.entity";
import { TransactionDetails } from "../../database/entities/transaction-details.entity";
import { Transaction } from "../../database/entities/transaction.entity";
import { NetworkService } from "../../services/network.service";

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    private network: NetworkService,
    private dataSource: DataSource,
  ) {}

  async findOneByHash(
    neighborhoodId: number,
    hash: ArrayBuffer,
    details = false,
  ): Promise<Transaction | null> {
    let query = this.transactionRepository
      .createQueryBuilder("t")
      .where("t.hash = :hash", { hash })
      .leftJoinAndSelect("t.block", "block")
      .andWhere("block.neighborhoodId = :nid", { nid: neighborhoodId })
      .addOrderBy("block.height", "DESC");

    if (details) {
      query = query.innerJoinAndMapOne(
        "t.details",
        TransactionDetails,
        "details",
        `"details"."transactionId" = t.id`,
      );
    }
    return await query.getOne();
  }

  public async findMany(
    neighborhoodId: number,
    options: IPaginationOptions,
    additional?: {
      method?: string;
      details?: boolean;
    },
  ): Promise<Pagination<Transaction>> {
    let query = this.transactionRepository
      .createQueryBuilder("t")
      .leftJoinAndSelect("t.block", "block")
      .where("block.neighborhoodId = :nid", { nid: neighborhoodId })
      .addOrderBy("block.height", "DESC");

    if (additional?.details) {
      query = query.innerJoinAndMapOne(
        "t.details",
        TransactionDetails,
        "details",
        `"details"."transactionId" = t.id`,
      );

      if (additional?.method) {
        query = query.andWhere("details.method = :method", {
          method: additional.method,
        });
      }
    }
    return await paginate<Transaction>(query, options);
  }

  async findManyByIds(
    neighborhood: Neighborhood,
    ids: number[],
  ): Promise<Transaction[]> {
    const query = this.transactionRepository
      .createQueryBuilder("t")
      .leftJoinAndSelect("t.block", "block")
      .where({ block: { neighborhood } })
      .andWhereInIds(ids);

    return await query.getMany();
  }

  async save(tx: Transaction): Promise<Transaction> {
    return await this.transactionRepository.save(tx);
  }
}
