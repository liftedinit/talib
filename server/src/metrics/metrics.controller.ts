import {
  Controller,
  DefaultValuePipe,
  Get,
  Delete,
  Param,
  ParseIntPipe,
  Query,
  Logger,
} from "@nestjs/common";
import { ApiOkResponse } from "@nestjs/swagger";
import { MetricDto } from "../dto/metric.dto";
import { Pagination } from "nestjs-typeorm-paginate";
import { MetricsService, SeriesEntity } from "./metrics.service";
import { ApiQuery } from "@nestjs/swagger";

@Controller("metrics")
export class MetricsController {
  private readonly logger = new Logger(MetricsService.name);

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

  @Get(":name/current")
  getMetricQueryCurrent(@Param("name") name: string) {
    return this.metrics.getCurrent(name);
  }

  @Get(":name/series")
  @ApiQuery({ name: "from", required: false })
  @ApiQuery({ name: "to", required: false })
  @ApiQuery({ name: "hours", required: false })
  getMetricQuerySeries(
    @Param("name") name: string,
    @Query("from") from?: string,
    @Query("to") to?: string,
    @Query("hours") hours?: number,
  ): Promise<SeriesEntity[]> {
    if (!hours) {
      hours = 24;
    }
    let currentDate: Date;
    let previousDate: Date;

    if (!from) {
      currentDate = new Date();
    } else {
      currentDate = new Date();
    }
    if (!to) {
      previousDate = new Date();
      previousDate.setHours(previousDate.getHours() - hours);
    } else {
      const fromParts = from.split("-");
      const fromDays = Number(fromParts[1].replace("d", ""));
      const fromHours = fromDays * 24;
      previousDate = new Date();
      previousDate.setHours(previousDate.getHours() - fromHours);
    }

    return this.metrics.getSeries(name, currentDate, previousDate);
  }

  @Delete(":name")
  async remove(@Param("name") name: string): Promise<void> {
    await this.metrics.removeByMetricQueryName(name);
  }
}
