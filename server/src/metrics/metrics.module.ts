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
import { MetricsSchedulerConfigModule } from "src/config/metrics-scheduler/configuration.module";
import { MetricsSchedulerConfigService } from "src/config/metrics-scheduler/configuration.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      // Neighborhood,
      Metric,
      PrometheusQuery,
    ]),
    HttpModule,
    MetricsSchedulerConfigModule,
    PrometheusQueryModule,
    PrometheusQueryDetailsModule,
  ],
  providers: [
    MetricsService,
    // NetworkService,
    // TxAnalyzerService,
    MetricsSchedulerConfigService,
    PrometheusQueryService,
    PrometheusQueryDetailsService,
  ],
  controllers: [MetricsController],
  exports: [
    MetricsService,
    PrometheusQueryDetailsService,
    MetricsSchedulerConfigService,
  ],
})
export class MetricModule {}
