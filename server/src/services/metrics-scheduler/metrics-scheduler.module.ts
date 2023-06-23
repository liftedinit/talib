import { Module, Provider } from "@nestjs/common";
import { ModuleRef } from "@nestjs/core";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MetricsSchedulerConfigModule } from "../../config/metrics-scheduler/configuration.module";
import { MetricsSchedulerConfigService } from "../../config/metrics-scheduler/configuration.service";

import { Metric } from "../../database/entities/metric.entity";
import { MetricsService } from "../../metrics/metrics.service";
// import { MetricsUpdater } from "./metrics-updater/updater";
import { MetricsSchedulerController } from "./metrics-scheduler.controller";
import { MetricsSchedulerService } from "./metrics-scheduler.service";
import { PrometheusQueryService } from "src/metrics/prometheus-query/query.service";
import { PrometheusQuery } from "src/database/entities/prometheus-query.entity";
import { MetricUpdater } from "./metric-updater/updater";
// import { MetricsAnalyzerService } from "./metrics-analyzer.service";

export const myServiceProvider: Provider = {
  provide: "PROMETHEUS_QUERY_FACTORY",
  inject: [ModuleRef],
  useFactory: (m: ModuleRef) => async (p: PrometheusQuery) =>
    (await m.create(MetricUpdater)).with(p),
};

@Module({
  controllers: [MetricsSchedulerController],
  imports: [
    TypeOrmModule.forFeature([Metric, PrometheusQuery]),
    MetricsSchedulerConfigModule,
  ],
  providers: [
    MetricsSchedulerConfigService,
    MetricsService,
    // MetricsAnalyzerService,
    MetricsSchedulerService,
    PrometheusQueryService,
    myServiceProvider,
  ],
  exports: [MetricsSchedulerService],
})
export class MetricsSchedulerModule {}
