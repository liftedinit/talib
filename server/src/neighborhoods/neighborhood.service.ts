import { Address } from "@liftedinit/many-js";
import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, SelectQueryBuilder } from "typeorm";
import { Block } from "../database/entities/block.entity";
import { Neighborhood } from "../database/entities/neighborhood.entity";
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
    private block: BlockService,
    private network: NetworkService,
  ) {}

  findAll(): Promise<Neighborhood[]> {
    return this.neighborhoodRepository.find();
  }

  private addDetailsToQuery(query: SelectQueryBuilder<Neighborhood>) {
    return query
      .innerJoin("n.blocks", "blocks")
      .innerJoin("blocks.transactions", "transactions")
      .addSelect("COUNT(transactions.id)", "txCount")

      .loadRelationCountAndMap("n.txCount", "blocks.transactions", "n.txCount")

      .leftJoinAndMapOne(
        "n.latestBlock",
        "n.blocks",
        "block",
        "n.id = block.neighborhoodId",
      )
      .where(
        (_qb) =>
          "block.height = " +
          query
            .subQuery()
            .select("MAX(height)")
            .from(Block, "block")
            .where("n.id = block.neighborhoodId")
            .getQuery(),
      );
  }

  async findOne(
    where: { address?: Address | string; id?: number },
    details = false,
  ): Promise<Neighborhood | null> {
    if (where.address !== undefined) {
      (where as any).address_ = where.address.toString();
    }

    let query = this.neighborhoodRepository
      .createQueryBuilder("n")
      .where(where)
      .limit(1);

    if (details) {
      query = this.addDetailsToQuery(query);
    }

    query = query.groupBy("n.id, block.id");
    this.logger.debug(
      `findOne(${JSON.stringify(where)}, ${details}): \`${query.getQuery()}\``,
    );

    const { raw, entities } = await query.getRawAndEntities();
    const one = entities[0];
    one.txCount = Number(raw[0].txCount);
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
