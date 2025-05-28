import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Metric } from "../database/entities/metric.entity";
import { Block } from "../database/entities/block.entity";
import { Transaction } from "../database/entities/transaction.entity";
import { Location } from "../database/entities/location.entity";
import { MetricsController } from "./metrics.controller";
import { MetricsService } from "./metrics.service";
import { PrometheusQueryDetailsService } from "./prometheus-query-details/query-details.service";
import { PrometheusQueryDetailsModule } from "./prometheus-query-details/query-details.module";
import { PrometheusQueryModule } from "./prometheus-query/query.module";
import { HttpModule } from "@nestjs/axios";
import { PrometheusQueryService } from "./prometheus-query/query.service";
import { PrometheusQuery } from "..//database/entities/prometheus-query.entity";
import { MetricsSchedulerConfigModule } from "../config/metrics-scheduler/configuration.module";
import { MetricsSchedulerConfigService } from "../config/metrics-scheduler/configuration.service";
import { TransformsModule } from "./transform/transforms.module";
import { TransformsService } from "./transform/transforms.service";
import { SystemWideModule } from "./systemwide/systemwide.module";
import { SystemWideService } from "./systemwide/systemwide.service";
import { SystemWideMetric } from "../database/entities/systemwide-metric.entity";
import { LocationModule } from "./location/location.module";
import { LocationService } from "./location/location.service";
import { MonitoringModule } from "./monitoring/monitoring.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Metric, Location, Block, Transaction, SystemWideMetric, PrometheusQuery]),
    MonitoringModule,
    HttpModule,
    MetricsSchedulerConfigModule,
    PrometheusQueryModule,
    PrometheusQueryDetailsModule,
    LocationModule,
    TransformsModule,
    SystemWideModule,
  ],
  providers: [
    LocationService,
    MetricsService,
    MetricsSchedulerConfigService,
    PrometheusQueryService,
    PrometheusQueryDetailsService,
    TransformsService,
    SystemWideService,
  ],
  controllers: [MetricsController],
  exports: [
    MetricsService,
    PrometheusQueryDetailsService,
    MetricsSchedulerConfigService,
    TransformsService,
    SystemWideService,
  ],
})
export class MetricModule {}
