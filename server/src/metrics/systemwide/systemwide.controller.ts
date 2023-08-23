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

  @Get("totaltransactions/current")
  getTransactionsTotalCurrent() {
    return this.systemwide.getTotalTransactions();
  }
}
