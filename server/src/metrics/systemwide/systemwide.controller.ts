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
import { SystemWideService } from "./systemwide.service";
import { MetricDto } from "../../dto/metric.dto";
import { MetricsService, SeriesEntity } from "../metrics.service";
import { Block as BlockEntity } from "../../database/entities/block.entity";

@Controller("metrics/systemwide")
export class SystemWideController {
  private readonly logger = new Logger(SystemWideController.name);

  constructor(
    private systemwide: SystemWideService,
    private metrics: MetricsService,
  ) {}

  @Get("totalblocks/current")
  getBlocksTotalCurrent() {
    return this.systemwide.getTotalBlocks();
  }

  @Get("totalblocks/series")
  @ApiQuery({ name: "from", required: false })
  @ApiQuery({ name: "to", required: false })
  @ApiQuery({ name: "hours", required: false })
  getBlocksTotalSeries(
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

    return this.systemwide.getTotalBlocksSeries(currentDate, previousDate);
  }

  @Get("totaltransactions/current")
  getTransactionsTotalCurrent() {
    return this.systemwide.getTotalTransactions();
  }
}
