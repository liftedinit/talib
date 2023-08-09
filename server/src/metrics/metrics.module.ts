import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Metric } from "../database/entities/metric.entity";
import { MetricsController } from "./metrics.controller";
import { MetricsService } from "./metrics.service";
import { PrometheusQueryDetailsService } from "./prometheus-query-details/query-details.service";
import { PrometheusQueryDetailsModule } from "./prometheus-query-details/query-details.module";
import { PrometheusQueryModule } from "./prometheus-query/query.module";
import { HttpModule } from "@nestjs/axios";
import { PrometheusQueryService } from "./prometheus-query/query.service";
import { PrometheusQuery } from "src/database/entities/prometheus-query.entity";
import { MetricsSchedulerConfigModule } from "src/config/metrics-scheduler/configuration.module";
import { MetricsSchedulerConfigService } from "src/config/metrics-scheduler/configuration.service";
import { FunctionsModule } from "./functions/functions.module";
import { FunctionsService } from "./functions/functions.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([Metric, PrometheusQuery]),
    HttpModule,
    MetricsSchedulerConfigModule,
    PrometheusQueryModule,
    PrometheusQueryDetailsModule,
    FunctionsModule,
  ],
  providers: [
    MetricsService,
    MetricsSchedulerConfigService,
    PrometheusQueryService,
    PrometheusQueryDetailsService,
    FunctionsService,
  ],
  controllers: [MetricsController],
  exports: [
    MetricsService,
    PrometheusQueryDetailsService,
    MetricsSchedulerConfigService,
    FunctionsService,
  ],
})
export class MetricModule {}
