import {
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  Query,
} from "@nestjs/common";
import { ApiOkResponse } from "@nestjs/swagger";
import { MetricDetailsDto, MetricDto } from "../dto/metric.dto";
import { Pagination } from "nestjs-typeorm-paginate";
import { MetricsService } from "./metrics.service";

@Controller("metrics")
export class MetricsController {
  constructor(private metrics: MetricsService) {}

  @Get()
  @ApiOkResponse({
    type: MetricDto,
    isArray: true,
    description: "List all events for a neighborhood.",
  })
  async findAll(
    @Param("pid", ParseIntPipe) pid: number,
    @Query("page", new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query("limit", new DefaultValuePipe(10), ParseIntPipe) limit = 10,
  ): Promise<Pagination<MetricDto>> {
    limit = limit > 100 ? 100 : limit;

    const result = await this.metrics.findMany(pid, { page, limit });
    return {
      ...result,
      items: result.items.map((b) => b.intoDto()),
    };
  }
}
