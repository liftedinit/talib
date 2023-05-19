import { Controller, Get, Param } from "@nestjs/common";
import { MetricDetailsService } from "./metric-details.service";

@Controller("metrics")
export class MetricDetailsController {
  constructor(private metricDetailsService: MetricDetailsService) {}

  @Get(":name/current")
  getMetricCurrent(@Param("name") name: string) {
    return this.metricDetailsService.getMetricCurrentValue(name);
  }
}
