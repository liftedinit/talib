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
import { TransformsService } from "./transforms.service";
import { MetricDto } from "../../dto/metric.dto";
import { MetricsService, SeriesEntity } from "../metrics.service";
import { Block as BlockEntity } from "../../database/entities/block.entity";

@Controller("metrics/transforms")
export class TransformsController {
  private readonly logger = new Logger(TransformsController.name);

  constructor(
    private transforms: TransformsService,
    private metrics: MetricsService,
  ) {}

  @Get(":name/sumtotal/current")
  getPrometheusQuerySumTotalCurrent(@Param("name") name: string) {
    return this.transforms.getSumTotal(name);
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

    return this.transforms.getSeriesSumTotal(name, currentDate, previousDate);
  }
}
