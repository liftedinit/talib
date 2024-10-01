import { Address } from "@liftedinit/many-js";
import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from "nestjs-typeorm-paginate";
import { Neighborhood } from "src/database/entities/neighborhood.entity";
import { Repository } from "typeorm";
import { Token as TokenEntity } from "../../database/entities/token.entity";
import { TokenDetailsDto } from "../../dto/token.dto";

@Injectable()
export class TokensService {
    private readonly logger = new Logger(TokensService.name);

    constructor(
      @InjectRepository(TokenEntity)
      private tokenRepository: Repository<TokenEntity>,
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

    async getTokens(
      neighborhood: Neighborhood,
      options: IPaginationOptions,
    ): Promise<Pagination<TokenEntity>> {
      const query = this.tokenRepository
        .createQueryBuilder("t")
        .where("t.neighborhoodId = :nid", { nid: neighborhood.id })
        .orderBy("t.id", "DESC");

      this.logger.debug(`getTokens: ${query.getQuery()}`);
      return await paginate(query, options);
    }

    public async getTokenDetails(
      neighborhoodId: number,
      address: Address,
    ): Promise<TokenDetailsDto> {
      const token = await this.tokenRepository
        .createQueryBuilder("t")
        .where("t.address = :address", { address: address.toString() })
        .andWhere("t.neighborhoodId = :nid", { nid: neighborhoodId })
        .getOne();

      if (!token) {
        throw new Error("Token not found");
      }

      return token.intoDto();
    }

    async save(token: TokenEntity): Promise<TokenEntity> {
      return this.tokenRepository.save(token);
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


    async getAllTokens(neighborhood: Neighborhood): Promise<TokenEntity[]> {
      const limit = 100;
      let page = 1;
    
      // Get the initial response to get the total number of items
      const initialResponse = await this.getTokens(neighborhood, { page, limit });
      const totalItems = initialResponse.meta.totalItems;
    
      let allTokens = initialResponse.items;
    
      // Calculate the total number of pages
      const totalPages = Math.ceil(totalItems / limit);
    
      // Get the remaining pages
      for (page = 2; page <= totalPages; page++) {
        const response = await this.getTokens(neighborhood, { page, limit} );
        allTokens = allTokens.concat(response.items);
      }
    
      return allTokens;
    }

}
