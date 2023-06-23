import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Metric } from "../database/entities/metric.entity";
import { MetricsController } from "./metrics.controller";
import { MetricsService } from "./metrics.service";
// import { MetricsAnalyzerService } from "../services/metrics-scheduler/metrics-analyzer.service";
import { PrometheusQueryDetailsService } from "./prometheus-query-details/query-details.service";
import { PrometheusQueryDetailsModule } from "./prometheus-query-details/query-details.module";
import { PrometheusQueryModule } from "./prometheus-query/query.module";
import { HttpModule } from "@nestjs/axios";
import { PrometheusQueryService } from "./prometheus-query/query.service";
import { PrometheusQuery } from "src/database/entities/prometheus-query.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      // Neighborhood,
      Metric,
      PrometheusQuery,
    ]),
    HttpModule,
    PrometheusQueryModule,
    PrometheusQueryDetailsModule,
  ],
  providers: [
    MetricsService,
    // NetworkService,
    // TxAnalyzerService,
    PrometheusQueryService,
    PrometheusQueryDetailsService,
  ],
  controllers: [MetricsController],
  exports: [MetricsService, PrometheusQueryDetailsService],
})
export class MetricModule {}
