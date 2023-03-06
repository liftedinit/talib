import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from "nestjs-typeorm-paginate";
import { DataSource, Repository } from "typeorm";
import { Block } from "../../database/entities/block.entity";
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
  ): Promise<Pagination<Transaction>> {
    const query = this.transactionRepository
      .createQueryBuilder("t")
      .leftJoin("t.block", "blocks")
      .where("blocks.neighborhoodId = :nid")
      .setParameter("nid", neighborhoodId);
    console.log(query.getQuery());
    return await paginate<Transaction>(query, options);
  }
}
