import { Address } from "@liftedinit/many-js";
import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from "nestjs-typeorm-paginate";
import { Neighborhood } from "src/database/entities/neighborhood.entity";
import { Brackets, Repository } from "typeorm";
import { Token as TokenEntity } from "../../database/entities/token.entity";
import { Event as EventEntity } from "../../database/entities/event.entity";
import { TokenDetailsDto } from "../../dto/token.dto";

@Injectable()
export class TokensService {
    private readonly logger = new Logger(TokensService.name);

    constructor(
      @InjectRepository(TokenEntity)
      private tokenRepository: Repository<TokenEntity>,
      @InjectRepository(EventEntity)
      private eventRepository: Repository<EventEntity>,
    ) {}

    public async findMany(
      neighborhoodId: number, 
      options: IPaginationOptions,
    ) {
      const query = this.tokenRepository
        .createQueryBuilder("t")
        .where("t.neighborhoodId = :nid", { nid: neighborhoodId })
        .orderBy("t.id", "DESC");

      this.logger.debug(`findMany: ${query.getQuery()}`);
      return await paginate(query, options);
    }

    public async findManyTokenEvents(
      neighborhoodId: number,
      options: IPaginationOptions,
    ): Promise<Pagination<EventEntity>> {
      const query = this.eventRepository
        .createQueryBuilder("e")
        .where("e.neighborhoodId = :nid", { nid: neighborhoodId })
        .andWhere("e.method = 'tokens.create'")
        .orderBy("e.eventId", "DESC");
  
      this.logger.debug(`findMany events(${neighborhoodId}: ${query.getQuery()}`);
      return await paginate(query, options);
    }

    async getTokens(neighborhood: Neighborhood): Promise<Pagination<TokenEntity>> {
      const query = this.tokenRepository
        .createQueryBuilder("t")
        .where("t.neighborhoodId = :nid", { nid: neighborhood.id })
        .orderBy("t.id", "DESC");

      this.logger.debug(`getTokens: ${query.getQuery()}`);
      return await paginate(query, { page: 1, limit: 10 });
    }

    async addToken(
      neighborhood: Neighborhood, 
      tokenInfo: any ) {
      const token = new TokenEntity();

      // parse token info and save to database 
      token.neighborhood = neighborhood;
      token.address = tokenInfo.address;
      token.symbol = tokenInfo.symbolInfo.symbol;
      token.name = tokenInfo.symbolInfo.name;
      token.precision = tokenInfo.symbolInfo.decimals;

      this.logger.debug(`addToken ${JSON.stringify(token)}`)

      await this.tokenRepository.save(token)

      return null
    }


}
