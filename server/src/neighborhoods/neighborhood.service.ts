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
      .innerJoinAndMapOne(
        "n.latestBlock",
        "n.blocks",
        "block",
        "n.id = block.neighborhoodId",
      )
      .andWhere(
        (qb) =>
          "block.height = " +
          qb
            .subQuery()
            .select("MAX(height)")
            .from(Block, "block")
            .where({
              neighborhood: { id: nid },
            })
            .getQuery(),
      )
      .groupBy("n.id, block.id")
      .limit(1);

    this.logger.debug(`get(${nid}): \`${query.getQuery()}\``);

    // Build transaction count query
    const txCountQuery = this.transactionRepository
      .createQueryBuilder("t")
      .leftJoin("t.block", "block")
      .where("block.neighborhoodId = :nid", { nid });
    this.logger.debug(`txCount(${nid}): \`${txCountQuery.getQuery()}\``);

    // Run both queries in parallel
    const [one, txCount] = await Promise.all([
      query.getOne(),
      txCountQuery.getCount(),
    ]);

    if (!one) {
      return null;
    }

    one.txCount = Number(txCount);
    return one;
  }

  async create(dto: CreateNeighborhoodDto): Promise<Neighborhood> {
    this.logger.debug(`create(${JSON.stringify(dto)})`);
    const url = dto.url;
    const network = await this.network.forUrl(url);
    const status = (await network.base.status()).status;
    if (!status) {
      throw new Error("Server returned an invalid status.");
    }

    const entity = Neighborhood.createWithDto(status, dto);
    await this.neighborhoodRepository.save([entity]);

    return entity;
  }

  async removeById(id: number): Promise<void> {
    await this.neighborhoodRepository.delete({ id });
  }

  async resetNeighborhood(id: number, n: Neighborhood) {
    await this.blockRepository.delete({ neighborhood: { id } });
    n.id = id;
    n.clean();
    await this.neighborhoodRepository.update({ id }, n);
  }
}
