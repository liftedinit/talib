import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from "nestjs-typeorm-paginate";
import { DataSource, Repository } from "typeorm";
import { Block } from "../../database/entities/block.entity";
import { Neighborhood } from "../../database/entities/neighborhood.entity";
import { TransactionDetails } from "../../database/entities/transaction-details.entity";
import { Transaction } from "../../database/entities/transaction.entity";
import { NetworkService } from "../../services/network.service";

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Block)
    private blockRepository: Repository<Block>,
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    private network: NetworkService,
    private dataSource: DataSource,
  ) {}

  async findOneByHash(
    neighborhoodId: number,
    hash: ArrayBuffer,
    details?: boolean,
  ) {
    return await this.blockRepository.findOne({
      where: {
        neighborhood: { id: neighborhoodId },
        hash: hash as any,
      },
      ...(details && {
        relations: {
          transactions: true,
        },
      }),
    });
  }

  public async findMany(
    neighborhoodId: number,
    options: IPaginationOptions,
    additional?: {
      details: boolean;
    },
  ): Promise<Pagination<Transaction>> {
    let query = this.transactionRepository
      .createQueryBuilder("t")
      .leftJoinAndSelect("t.block", "block")
      .where("block.neighborhoodId = :nid", { nid: neighborhoodId });

    if (additional?.details) {
      query = query.innerJoinAndMapOne(
        "t.details",
        TransactionDetails,
        "details",
        "details.transactionId = t_id",
      );
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
}
