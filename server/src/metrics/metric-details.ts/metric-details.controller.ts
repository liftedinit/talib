import { Controller, Get } from "@nestjs/common";
import { MetricDetailsService } from "./metric-details.service";

// @Controller("metrics/:mid/metric")
@Controller("metrics")
export class MetricDetailsController {
  constructor(private metricDetailsService: MetricDetailsService) {}

  @Get("nodecount/metric/current")
  getCurrentNodeCount() {
    return this.metricDetailsService.getCurrentNodeCount();
  }
}
