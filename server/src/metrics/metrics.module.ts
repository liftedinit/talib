import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Metric } from "../database/entities/metric.entity";
import { MetricsController } from "./metrics.controller";
import { MetricsService } from "./metrics.service";
// import { MetricsAnalyzerService } from "../services/metrics-scheduler/metrics-analyzer.service";
import { PrometheusQueryDetailsService } from "./prometheus-query-details/query-details.service";
import { PrometheusQueryDetailsModule } from "./prometheus-query-details/query-details.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      // Neighborhood,
      Metric,
    ]),
    PrometheusQueryDetailsModule,
  ],
  providers: [
    MetricsService,
    // NetworkService,
    // TxAnalyzerService,
    PrometheusQueryDetailsService,
  ],
  controllers: [MetricsController],
  exports: [MetricsService, PrometheusQueryDetailsService],
})
export class MetricModule {}
