import { Address } from "@liftedinit/many-js";
import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, DataSource, Repository } from "typeorm";
import { Block } from "../../database/entities/block.entity";
import { TransactionDetails } from "../../database/entities/transaction-details.entity";
import { Transaction } from "../../database/entities/transaction.entity";
import { AddressDto } from "../../dto/address.dto";
import { NetworkService } from "../../services/network.service";
import { TxAnalyzerService } from "../../services/scheduler/tx-analyzer.service";

@Injectable()
export class AddressesService {
  private readonly logger = new Logger(AddressesService.name);

  constructor(
    @InjectRepository(Block)
    private blockRepository: Repository<Block>,
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    private network: NetworkService,
    private dataSource: DataSource,
    private analyzer: TxAnalyzerService,
  ) {}

  async findTransactions(
    nid: number,
    address: Address,
  ): Promise<Transaction[]> {
    const query = this.transactionRepository
      .createQueryBuilder("t")
      .leftJoinAndSelect("t.block", "block")
      .innerJoinAndMapOne(
        "t.details",
        TransactionDetails,
        "details",
        `"details"."transactionId" = t.id`,
      )
      .where("block.neighborhoodId = :nid", { nid })
      .andWhere(
        new Brackets((qb) => {
          qb.where(":address = ANY(details.addresses)", {
            address: address.toString(),
          });
          qb.orWhere(":address = details.sender", {
            address: address.toString(),
          });
        }),
      )
      .addOrderBy("block.height", "DESC");

    this.logger.debug(`getMany(${nid}, ${address}): ${query.getQuery()}`);
    return query.getMany();
  }

  async findOne(nid: number, address: Address): Promise<AddressDto> {
    return {
      address: address.toString(),
      transactions: (await this.findTransactions(nid, address)).map((t) =>
        t.intoDto(),
      ),
    };
  }
}
