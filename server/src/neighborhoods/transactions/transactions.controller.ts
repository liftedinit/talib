import {
  Controller,
  DefaultValuePipe,
  Get,
  NotFoundException,
  Optional,
  Param,
  ParseIntPipe,
  Query,
} from "@nestjs/common";
import { ApiOkResponse, ApiOperation, ApiResponse, ApiParam } from "@nestjs/swagger";
import { Pagination } from "nestjs-typeorm-paginate";
import {
  TransactionDetailsDto,
  TransactionDto,
} from "../../dto/transaction.dto";
import { ParseHashPipe } from "../../utils/pipes";
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
    @Optional() @Query("method") method?: string,
  ): Promise<Pagination<TransactionDto>> {
    limit = limit > 100 ? 100 : limit;

    const result = await this.transactions.findMany(
      nid,
      { page, limit },
      { details: true, method },
    );
    return {
      ...result,
      items: result.items.map((b) => b.intoDto()),
    };
  }

  @Get(":thash")
  @ApiOperation({
    description: "Show the details of a single transaction.",
  })
  @ApiParam({ name: 'thash', type: 'string', description: 'Transaction hash' })
  @ApiOkResponse({
    type: TransactionDetailsDto,
    isArray: true,
  })
  async findOne(
    @Param("nid", ParseIntPipe) nid: number,
    @Param("thash", ParseHashPipe) thash: ArrayBuffer,
  ): Promise<TransactionDetailsDto> {
    const tx = await this.transactions.findOneByHash(nid, thash, true);
    if (!tx) {
      throw new NotFoundException();
    }
    return tx.intoDetailsDto();
  }
}
