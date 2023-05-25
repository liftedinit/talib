import { Controller, Get, Param, Query } from "@nestjs/common";
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
  ) {
    if (!from) {
      from = "now-5m";
    }
    if (!to) {
      to = "now";
    }
    return this.prometheusQueryDetailsService.getPrometheusQueryCurrentValue(
      name,
      from,
      to,
    );
  }

  @Get(":name/series")
  getPrometheusQuerySeries(
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
    return this.prometheusQueryDetailsService.getPrometheusQuerySeries(
      name,
      from,
      to,
    );
  }
}
