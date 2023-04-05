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
import { ParseAlternatePipe, ParseHashPipe } from "../../utils/pipes";
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
  ): Promise<Pagination<BlockDto>> {
    limit = limit > 100 ? 100 : limit;

    return await this.block.findManyDto(nid, { page, limit });
  }

  @Get(":bhash")
  @ApiResponse({
    status: 200,
    type: BlockDetailsDto,
  })
  async findOne(
    @Param("nid", ParseIntPipe) nid: number,
    @Param(
      "bhash",
      new ParseAlternatePipe(new ParseIntPipe(), new ParseHashPipe()),
    )
    bhash: ArrayBuffer | number,
  ): Promise<BlockDetailsDto> {
    console.log(bhash);
    let b;
    if (typeof bhash == "number") {
      b = await this.block.findOneByHeight(nid, bhash);
    } else {
      b = await this.block.findOneByHash(nid, bhash);
    }

    if (!b) {
      throw new NotFoundException();
    }

    return b.intoDetailsDto();
  }
}
