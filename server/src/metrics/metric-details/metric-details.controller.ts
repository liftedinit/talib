import { Controller, Get, Param, Query } from "@nestjs/common";
import { MetricDetailsService } from "./metric-details.service";

@Controller("metrics")
export class MetricDetailsController {
  constructor(private metricDetailsService: MetricDetailsService) {}

  @Get(":name/current")
  getMetricCurrent(
    @Param("name") name: string,
    @Query("from") from?: string,
    @Query("to") to?: string,
  ) {
    if (!from) {
      from = "now-5m";
    }
    if (!to) {
      to = "now";
    }
    return this.metricDetailsService.getMetricCurrentValue(name, from, to);
  }

  @Get(":name/series")
  getMetricSeries(
    @Param("name") name: string,
    @Query("from") from?: string,
    @Query("to") to?: string,
  ) {
    if (!from) {
      from = "now-5m";
    }
    if (!to) {
      to = "5m";
    }
    return this.metricDetailsService.getMetricSeries(name, from, to);
  }
}
