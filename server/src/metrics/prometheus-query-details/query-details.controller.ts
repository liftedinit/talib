import { Controller, Get, Param, Query, ParseIntPipe } from "@nestjs/common";
import { PrometheusQueryDetailsService } from "./query-details.service";

@Controller("prometheusquery")
export class PrometheusQueryDetailsController {
  constructor(
    private prometheusQueryDetailsService: PrometheusQueryDetailsService,
  ) {}

  @Get(":name/current")
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
