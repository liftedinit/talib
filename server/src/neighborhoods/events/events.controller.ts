import {
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  Query,
} from "@nestjs/common";
import { ApiOkResponse } from "@nestjs/swagger";
import { Pagination } from "nestjs-typeorm-paginate";
import { EventDto } from "../../dto/event.dto";
import { TransactionDto } from "../../dto/transaction.dto";
import { EventsService } from "./events.service";

@Controller("neighborhoods/:nid/events")
export class EventsController {
  constructor(private events: EventsService) {}

  @Get()
  @ApiOkResponse({
    type: TransactionDto,
    isArray: true,
    description: "List all events for a neighborhood.",
  })
  async findAll(
    @Param("nid", ParseIntPipe) nid: number,
    @Query("page", new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query("limit", new DefaultValuePipe(10), ParseIntPipe) limit = 10,
  ): Promise<Pagination<EventDto>> {
    limit = limit > 100 ? 100 : limit;

    const result = await this.events.findMany(nid, { page, limit });
    return {
      ...result,
      items: result.items.map((b) => b.intoDto()),
    };
  }
}
