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
import { ApiOkResponse } from "@nestjs/swagger";
import { Pagination  } from "nestjs-typeorm-paginate";
import { TokenDto, TokenDetailsDto } from "../../dto/token.dto";
import { TokensService } from "./tokens.service";
import { ParseAddressPipe } from "../../utils/pipes";

@Controller("neighborhoods/:nid/tokens")
export class TokensController {
  private logger: Logger;

  constructor(
    private tokens: TokensService,
    ) {}

  @Get()
  @ApiOkResponse({
    type: TokenDto,
    isArray: true, 
    description: "List all tokens for a neighborhood.",
  })
  async findAll(
    @Param("nid", ParseIntPipe) nid: number,
    @Query("page", new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query("limit", new DefaultValuePipe(100), ParseIntPipe) limit = 100,
  ): Promise<Pagination<TokenDto>> {
    limit = limit > 100 ? 100 : limit;

    const tokens = await this.tokens.findMany(nid, { page, limit });

    return {
      ...tokens, 
      items: tokens.items.map((t) => t.intoDto()),
    }
  }

  @Get(":address")
  @ApiOkResponse({
    type: TokenDto,
    isArray: false,
    description: "Show the details of a single token",
  })
  async findOne(
    @Param("nid", ParseIntPipe) nid: number,
    @Param("address", ParseAddressPipe) address: Address,
  ): Promise<TokenDetailsDto> {
    const token = await this.tokens.getTokenDetails(nid, address);

    return token;
  }

}
