import { Module, Provider } from "@nestjs/common";
import { ModuleRef } from "@nestjs/core";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MetricsSchedulerConfigModule } from "../../config/metrics-scheduler/configuration.module";
import { MetricsSchedulerConfigService } from "../../config/metrics-scheduler/configuration.service";
import { Metric } from "../../database/entities/metric.entity";
import { MetricsService } from "../../metrics/metrics.service";
import { MetricsSchedulerController } from "./metrics-scheduler.controller";
import { MetricsSchedulerService } from "./metrics-scheduler.service";
import { MetricQueryService } from "src/metrics/metric-query/query.service";
import { MetricQuery } from "../../database/entities/metric-query.entity";
import { MetricUpdater } from "./metric-updater/updater";
import { MetricQueryDetailsService } from "src/metrics/metric-query-details/query-details.service";
import { MetricQueryDetailsModule } from "src/metrics/metric-query-details/query-details.module";
import { MetricQueryModule } from "src/metrics/metric-query/query.module";
import { HttpModule } from "@nestjs/axios";

export const myServiceProvider: Provider = {
  provide: "PROMETHEUS_QUERY_FACTORY",
  inject: [ModuleRef],
  useFactory: (m: ModuleRef) => async (p: MetricQuery) =>
    (await m.create(MetricUpdater)).with(p),
};

@Module({
  controllers: [MetricsSchedulerController],
  imports: [
    TypeOrmModule.forFeature([Metric, MetricQuery]),
    MetricQueryModule,
    MetricQueryDetailsModule,
    HttpModule,
    MetricsSchedulerConfigModule,
  ],
  providers: [
    MetricsSchedulerConfigService,
    MetricsService,
    MetricsSchedulerService,
    MetricQueryService,
    MetricQueryDetailsService,
    myServiceProvider,
  ],
  exports: [MetricsSchedulerService],
})
export class MetricsSchedulerModule {}
