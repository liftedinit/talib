import {
  Controller,
  Get,
  Param,
  Query,
  ParseIntPipe,
  Logger,
} from "@nestjs/common";
import { PrometheusQueryDetailsService } from "./query-details.service";
import { Public } from "../../utils/decorators";
import { ApiQuery } from "@nestjs/swagger";

@Controller("prometheusquery")
export class PrometheusQueryDetailsController {
  private readonly logger = new Logger(PrometheusQueryDetailsService.name);

  constructor(
    private prometheusQueryDetailsService: PrometheusQueryDetailsService,
  ) {}

  @Public()
  @Get(":name/current")
  @ApiQuery({ name: "from", required: false })
  @ApiQuery({ name: "to", required: false })
  @ApiQuery({ name: "intervalMs", required: false })
  @ApiQuery({ name: "maxDataPoints", required: false })
  getPrometheusQueryCurrent(
    @Param("name") name: string,
    @Query("from") from?: string,
    @Query("to") to?: string,
    @Query("intervalMs", ParseIntPipe) intervalMs?: number,
    @Query("maxDataPoints", ParseIntPipe) maxDataPoints?: number,
  ) {
    if (!from) {
      from = "now-5m";
    }
    if (!to) {
      to = "now";
    }
    if (!intervalMs) {
      intervalMs = 30000;
    }
    if (!maxDataPoints) {
      maxDataPoints = 3000;
    }

    return this.prometheusQueryDetailsService.getPrometheusQueryCurrentValue(
      name,
      from,
      to,
      intervalMs,
      maxDataPoints,
    );
  }

  @ApiQuery({ name: "timestamp", required: false })
  @ApiQuery({ name: "intervalMs", required: false })
  @ApiQuery({ name: "maxDataPoints", required: false })
  @Get(":name/single")
  getPrometheusQuerySingle(
    @Param("name") name: string,
    @Query("timestamp", ParseIntPipe) timestamp?: number,
    @Query("intervalMs", ParseIntPipe) intervalMs?: number,
    @Query("maxDataPoints", ParseIntPipe) maxDataPoints?: number,
  ) {
    if (!intervalMs) {
      intervalMs = 30000;
    }
    if (!maxDataPoints) {
      maxDataPoints = 100;
    }

    this.logger.debug(`timestamp: \`${timestamp}\``);

    return this.prometheusQueryDetailsService.getPrometheusQuerySingleValue(
      name,
      timestamp,
      intervalMs,
      maxDataPoints,
    );
  }

  @Get(":name/series")
  getPrometheusQuerySeries(
    @Param("name") name: string,
    @Query("from") from?: string,
    @Query("to") to?: string,
    @Query("intervalMs", ParseIntPipe) intervalMs?: number,
    @Query("maxDataPoints", ParseIntPipe) maxDataPoints?: number,
  ) {
    if (!from) {
      from = "now-5m";
    }
    if (!to) {
      to = "5m";
    }
    if (!intervalMs) {
      intervalMs = 30000;
    }
    if (!maxDataPoints) {
      maxDataPoints = 3000;
    }
    return this.prometheusQueryDetailsService.getPrometheusQuerySeries(
      name,
      from,
      to,
      intervalMs,
      maxDataPoints,
    );
  }
}
