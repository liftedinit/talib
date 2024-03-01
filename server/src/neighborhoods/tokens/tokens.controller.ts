import {
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  Query,
} from "@nestjs/common";
import { ApiOkResponse, ApiOperation, ApiResponse, ApiQuery } from "@nestjs/swagger";
import { isArray } from "class-validator";
import { Pagination, IPaginationMeta } from "nestjs-typeorm-paginate";
import { EventDto } from "../../dto/event.dto";
import { TokenDto } from "../../dto/token.dto";
import { TransactionDto } from "../../dto/transaction.dto";
import { TokensService } from "./tokens.service";

@Controller("neighborhoods/:nid/tokens")
export class TokensController {
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

    const result = await this.tokens.findMany(nid, { page, limit });

    return result
  }

}