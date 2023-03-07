import { Address } from "@liftedinit/many-js";
import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Block } from "../database/entities/block.entity";
import { Neighborhood } from "../database/entities/neighborhood.entity";
import { Transaction } from "../database/entities/transaction.entity";
import { CreateNeighborhoodDto } from "../dto/neighborhood.dto";
import { NetworkService } from "../services/network.service";
import { BlockService } from "./blocks/block.service";

@Injectable()
export class NeighborhoodService {
  private readonly logger = new Logger(NeighborhoodService.name);

  constructor(
    @InjectRepository(Neighborhood)
    private neighborhoodRepository: Repository<Neighborhood>,
    @InjectRepository(Block)
    private blockRepository: Repository<Block>,
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    private block: BlockService,
    private network: NetworkService,
  ) {}

  findAll(): Promise<Neighborhood[]> {
    return this.neighborhoodRepository.find();
  }

  async get(nid: number): Promise<Neighborhood | null> {
    const query = this.neighborhoodRepository
      .createQueryBuilder("n")
      .where({ id: nid })
      .innerJoin("n.blocks", "blocks")

      .innerJoinAndMapOne(
        "n.latestBlock",
        "n.blocks",
        "block",
        "n.id = block.neighborhoodId",
      )
      .where(
        (qb) =>
          "block.height = " +
          qb
            .subQuery()
            .select("MAX(height)")
            .from(Block, "block")
            .where("n.id = block.neighborhoodId")
            .getQuery(),
      )
      .groupBy("n.id, block.id")
      .limit(1);

    this.logger.debug(`get(${nid}): \`${query.getQuery()}\``);

    const one = await query.getOne();
    if (!one) {
      return null;
    }

    // Separately do the transaction count.
    one.txCount = Number(
      await this.transactionRepository
        .createQueryBuilder("t")
        .leftJoin("t.block", "block")
        .where("block.neighborhoodId = :nid", { nid })
        .getCount(),
    );

    return one;
  }

  async create(dto: CreateNeighborhoodDto): Promise<Neighborhood> {
    const url = dto.url;
    const network = await this.network.forUrl(url);
    const status = (await network.base.status()).status;
    if (!status) {
      throw new Error("Server returned an invalid status.");
    }

    const entity = Neighborhood.createWithDto(status, dto);
    await this.neighborhoodRepository.save([entity]);

    await this.block.createLatestOf(entity);
    return entity;
  }

  async removeById(id: number): Promise<void> {
    await this.neighborhoodRepository.delete(id);
  }

  async removeByAddress(address: Address): Promise<void> {
    const entity = await this.neighborhoodRepository.findOneBy({
      address: address.toString(),
    });
    await this.removeById(entity.id);
  }
}
