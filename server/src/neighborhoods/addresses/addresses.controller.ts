import { Address } from "@liftedinit/many-js";
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
import { AddressDto } from "../../dto/address.dto";
import { EventDto } from "../../dto/event.dto";
import { TransactionDto } from "../../dto/transaction.dto";
import { ParseAddressPipe } from "../../utils/pipes";
import { AddressesService } from "./addresses.service";

const maxLimit = 1000;

@Controller("neighborhoods/:nid/addresses")
export class AddressesController {
  constructor(private address: AddressesService) {}

  @Get()
  @ApiResponse({
    status: 200,
  })
  async findAll(
    @Param("nid", ParseIntPipe) nid: number,
    @Query("page", new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query("limit", new DefaultValuePipe(100), ParseIntPipe) limit = 100,
  ): Promise<Pagination<string>> {
    limit = limit > 100 ? 100 : limit;
    return await this.address.findMany(nid, { page, limit });
  }

  @Get(":address")
  @ApiResponse({
    status: 200,
    type: AddressDto,
  })
  async findOne(
    @Param("nid", ParseIntPipe) nid: number,
    @Param("address", ParseAddressPipe) address: Address,
  ): Promise<AddressDto> {
    const a = await this.address.findOne(nid, address, { page: 1, limit: 100 });

    if (!a) {
      throw new NotFoundException();
    }

    return a;
  }

  @Get(":address/transactions")
  @ApiResponse({
    status: 200,
    type: TransactionDto,
    isArray: true,
  })
  async findTransactions(
    @Param("nid", ParseIntPipe) nid: number,
    @Param("address", ParseAddressPipe) address: Address,
    @Query("page", new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query("limit", new DefaultValuePipe(100), ParseIntPipe) limit = 100,
  ): Promise<Pagination<TransactionDto>> {
    limit = limit > 1000 ? 1000 : limit;
    const transactions = await this.address.findTransactions(nid, address, {
      page,
      limit,
    });

    return {
      ...transactions,
      items: transactions.items.map((t) => t.intoDto()),
    };
  }

  @Get(":address/events")
  @ApiResponse({
    status: 200,
    type: EventDto,
    isArray: true,
  })
  async findEvents(
    @Param("nid", ParseIntPipe) nid: number,
    @Param("address", ParseAddressPipe) address: Address,
    @Query("page", new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query("limit", new DefaultValuePipe(100), ParseIntPipe) limit = 100,
  ): Promise<Pagination<EventDto>> {
    limit = limit > maxLimit ? maxLimit : limit;
    const events = await this.address.findEvents(nid, address, {
      page,
      limit,
    });

    return {
      ...events,
      items: events.items.map((ev) => ev.intoDto()),
    };
  }

  @Get(":address/balances")
  @ApiResponse({
    status: 200,
    type: Number,
    isArray: true,
  })
  async findBalances(
    @Param("nid", ParseIntPipe) nid: number,
    @Param("address", ParseAddressPipe) address: Address,
    @Query("page", new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query("limit", new DefaultValuePipe(100), ParseIntPipe) limit = 100,
  ): Promise<Pagination<EventDto>> {
    limit = limit > maxLimit ? maxLimit : limit;
    const events = await this.address.findEvents(nid, address, {
      page,
      limit,
    });

    return {
      ...events,
      items: events.items.map((ev) => ev.intoDto()),
    };
  }
}
