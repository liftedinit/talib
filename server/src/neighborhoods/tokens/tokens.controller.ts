import { Address } from "@liftedinit/many-js";
import {
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  Logger,
  ParseIntPipe,
  Query,
} from "@nestjs/common";
import { ApiOkResponse, ApiOperation, ApiResponse, ApiQuery } from "@nestjs/swagger";
import { isArray } from "class-validator";
import { Pagination, IPaginationMeta } from "nestjs-typeorm-paginate";
import { EventDto } from "../../dto/event.dto";
import { TokenDto, TokenDetailsDto } from "../../dto/token.dto";
import { TransactionDto } from "../../dto/transaction.dto";
import { TokensService } from "./tokens.service";
import { ParseAddressPipe, ParseHashPipe } from "../../utils/pipes";

@Controller("neighborhoods/:nid/tokens")
export class TokensController {
  private logger: Logger;

  constructor(
    private tokens: TokensService,
    ) {}

  private mapToTokenDto(items: any[]): TokenDto[] {
    return items.map(item => {
      const tokenDto = new TokenDto();
      tokenDto.id = item.id; // Assuming item has an id property
      tokenDto.name = item.info.summary.name;
      tokenDto.symbol = item.info.symbol;
      tokenDto.address = item.info.holders; // Assuming holders is the address
      tokenDto.precision = item.info.summary.precision;
      return tokenDto;
    });
  }

  @Get("events")
  @ApiOkResponse({
    type: TransactionDto,
    isArray: true,
    description: "List all events for a neighborhood.",
  })
  async findAllTokenEvents(
    @Param("nid", ParseIntPipe) nid: number,
    @Query("page", new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query("limit", new DefaultValuePipe(10), ParseIntPipe) limit = 10,
  ): Promise<Pagination<TokenDto, IPaginationMeta>> {
    limit = limit > 100 ? 100 : limit;

    const result = await this.tokens.findManyTokenEvents(nid, { page, limit });

    return {
      ...result,
      items: this.mapToTokenDto(result.items),
    };
  }

  @Get()
  @ApiOkResponse({
    type: TokenDto,
    isArray: true, 
    description: "List all tokens for a neighborhood.",
  })
  async findAll(
    @Param("nid", ParseIntPipe) nid: number,
    @Query("page", new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query("limit", new DefaultValuePipe(10), ParseIntPipe) limit = 10,
  ): Promise<Pagination<TokenDto>> {
    limit = limit > 100 ? 100 : limit;

    const tokens = await this.tokens.findMany(nid, { page, limit });

    return {
      ...tokens, 
      items: tokens.items.map((t) => t.intoDto()),
    }
  }

  @Get(":address")
  @ApiOperation({
    description: "Show the details of a single token",
  })
  @ApiOkResponse({
    type: TokenDto,
    isArray: false,
  })
  async findOne(
    @Param("nid", ParseIntPipe) nid: number,
    @Param("address", ParseAddressPipe) address: Address,
    // @Param("address", ParseHashPipe) address: ArrayBuffer,
  ): Promise<TokenDetailsDto> {

    console.log(`address: ${address}`)
    const token = await this.tokens.getTokenDetails(nid, address);
    return token;
  }

}