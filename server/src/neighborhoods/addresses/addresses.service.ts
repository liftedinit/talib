import { Address } from "@liftedinit/many-js";
import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import {
  IPaginationOptions,
  paginate,
  paginateRaw,
  Pagination,
} from "nestjs-typeorm-paginate";
import { Brackets, DataSource, Repository } from "typeorm";
import { Block } from "../../database/entities/block.entity";
import { Event } from "../../database/entities/event.entity";
import { TransactionDetails } from "../../database/entities/transaction-details.entity";
import { Transaction } from "../../database/entities/transaction.entity";
import { AddressDto } from "../../dto/address.dto";
import { NetworkService } from "../../services/network.service";
import { TxAnalyzerService } from "../../services/scheduler/tx-analyzer.service";
import { EventsService } from "../events/events.service";

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
    private events: EventsService,
  ) {}

  async findTransactions(
    nid: number,
    address: Address,
    options: IPaginationOptions,
  ): Promise<Pagination<Transaction>> {
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
          qb.orWhere(":address = details.sender", {
            address: address.toString(),
          });
          qb.orWhere("details.argument->'amounts'->> :address IS NOT NULL", {
            address: address.toString(),
          });
        }),
      )
      .addOrderBy("block.height", "DESC");

    this.logger.debug(`getMany(${nid}, ${address}): ${query.getQuery()}`);
    return paginate(query, options);
  }

  async findEvents(
    nid: number,
    address: Address,
    options: IPaginationOptions,
  ): Promise<Pagination<Event>> {
    return await this.events.findWithAddress(nid, address, options);
  }

  async findOne(
    nid: number,
    address: Address,
    txOptions: IPaginationOptions,
    evOptions = txOptions,
  ): Promise<AddressDto> {
    const transactions = await this.findTransactions(nid, address, txOptions);
    const events = await this.findEvents(nid, address, evOptions);

    return {
      address: address.toString(),
      transactions: transactions.items.map((t) => t.intoDto()),
      events: events.items.map((e) => e.intoDto()),
    };
  }

  async findMany(
    nid: number,
    options: IPaginationOptions,
  ): Promise<Pagination<string>> {
    // select distinct unnest(category) as nestCategory from content
    const query = this.dataSource
      .createQueryBuilder()
      .from("block", "b")
      .distinct(true)
      .select("unnest(details.addresses)")
      .innerJoin("transaction", "t", "t.blockId = b.id")
      .innerJoin(
        "transaction_details",
        "details",
        "details.transactionId = t.id",
      )
      .where("b.neighborhoodId = :nid", { nid });

    this.logger.debug(`findMany(${nid}): ${query.getQuery()}`);
    const results = await paginateRaw(query, options);
    return {
      ...results,
      items: results.items.map((i) => i.unnest),
    };
  }
}
