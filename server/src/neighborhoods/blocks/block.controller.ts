import {
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  Query,
} from "@nestjs/common";
import { ApiResponse } from "@nestjs/swagger";
import { Pagination } from "nestjs-typeorm-paginate";
import { BlockDto } from "../../dto/block.dto";
import { BlockService } from "./block.service";

@Controller("api/v1/neighborhoods/:address/blocks")
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
    @Param("address") address: string,
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

    const result = await this.block.findMany({ page, limit }, withTransactions);
    const items = result.items.map((b) => b.intoDto());
    return {
      ...result,
      items,
    };
  }
}
