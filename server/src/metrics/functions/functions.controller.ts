import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Query,
  Logger,
} from "@nestjs/common";
import { ApiResponse } from "@nestjs/swagger";
import { ApiQuery } from "@nestjs/swagger";
import { FunctionsService } from "./functions.service";
import { MetricDto } from "../../dto/metric.dto";
import { MetricsService, SeriesEntity } from "../metrics.service";

@Controller("functions")
export class FunctionsController {
  private readonly logger = new Logger(FunctionsController.name);

  constructor(
    private functions: FunctionsService,
    private metrics: MetricsService,
  ) {}

  @Get(":name")
  @ApiResponse({
    status: 200,
    type: MetricDto,
    description: "Show info about one metric watched by this instance.",
  })
  async findOne(@Param("name") name: string): Promise<MetricDto> {
    const n = await this.functions.get(name);
    if (!n) {
      throw new NotFoundException();
    }

    return n.intoDto();
  }

  @Get(":name/sumtotal/current")
  getPrometheusQuerySumTotalCurrent(@Param("name") name: string) {
    return this.functions.getSumTotal(name);
  }

  @Get(":name/sumtotal/series")
  @ApiQuery({ name: "from", required: false })
  @ApiQuery({ name: "to", required: false })
  @ApiQuery({ name: "hours", required: false })
  getPrometheusQuerySumTotalSeries(
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

    return this.functions.getSeriesSumTotal(name);
  }
}
