import {
  Controller,
  DefaultValuePipe,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Query,
} from "@nestjs/common";
import { ApiResponse } from "@nestjs/swagger";
import { Pagination } from "nestjs-typeorm-paginate";
import { BlockDetailsDto, BlockDto } from "../../dto/block.dto";
import { ParseHashPipe } from "../../utils/pipes";
import { BlockService } from "./block.service";

@Controller("neighborhoods/:nid/blocks")
export class BlockController {
  constructor(private block: BlockService) {}

  @Get()
  @ApiResponse({
    status: 200,
    type: BlockDto,
    isArray: true,
    description: "List all blocks for a neighborhood.",
  })
  async findAll(
    @Param("nid", ParseIntPipe) nid: number,
    @Query("page", new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query("limit", new DefaultValuePipe(10), ParseIntPipe) limit = 10,
    @Query("withTx") withTx?: string,
  ): Promise<Pagination<BlockDto>> {
    limit = limit > 100 ? 100 : limit;

    let withTransactions;
    if (withTx !== undefined) {
      if (withTx == "true" || withTx == "1") {
        withTransactions = true;
      } else if (withTx == "false" || withTx == "0") {
        withTransactions = false;
      } else {
        withTransactions = undefined;
      }
    }

    const result = await this.block.findMany(
      nid,
      { page, limit },
      withTransactions,
    );
    const items = result.items.map((b) => b.intoDto());
    return {
      ...result,
      items,
    };
  }

  @Get(":bhash")
  @ApiResponse({
    status: 200,
    type: BlockDetailsDto,
  })
  async findOne(
    @Param("nid", ParseIntPipe) nid: number,
    @Param("bhash", ParseHashPipe) bhash: ArrayBuffer,
  ): Promise<BlockDetailsDto> {
    const b = await this.block.findOneByHash(nid, bhash, true);

    if (!b) {
      throw new NotFoundException();
    }

    return b.intoDetailsDto();
  }
}
