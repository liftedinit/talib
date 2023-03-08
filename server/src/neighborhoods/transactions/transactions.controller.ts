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
import { TransactionDto } from "../../dto/transaction.dto";
import { TransactionsService } from "./transactions.service";

@Controller("neighborhoods/:nid/transactions")
export class TransactionsController {
  constructor(private transactions: TransactionsService) {}

  @Get()
  @ApiResponse({
    status: 200,
    type: TransactionDto,
    isArray: true,
    description: "List all transactions for a neighborhood.",
  })
  async findAll(
    @Param("nid", ParseIntPipe) nid: number,
    @Query("page", new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query("limit", new DefaultValuePipe(10), ParseIntPipe) limit = 10,
  ): Promise<Pagination<TransactionDto>> {
    limit = limit > 100 ? 100 : limit;

    const result = await this.transactions.findMany(nid, { page, limit });
    return {
      ...result,
      items: result.items.map((b) => b.intoDto()),
    };
  }
}
