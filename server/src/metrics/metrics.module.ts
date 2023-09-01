import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Metric } from "../database/entities/metric.entity";
import { Block } from "../database/entities/block.entity";
import { Transaction } from "../database/entities/transaction.entity";
import { MetricsController } from "./metrics.controller";
import { MetricsService } from "./metrics.service";
import { MetricQueryDetailsService } from "./metric-query-details/query-details.service";
import { MetricQueryDetailsModule } from "./metric-query-details/query-details.module";
import { MetricQueryModule } from "./metric-query/query.module";
import { HttpModule } from "@nestjs/axios";
import { MetricQueryService } from "./metric-query/query.service";
import { MetricQuery } from "src/database/entities/metric-query.entity";
import { MetricsSchedulerConfigModule } from "src/config/metrics-scheduler/configuration.module";
import { MetricsSchedulerConfigService } from "src/config/metrics-scheduler/configuration.service";
import { TransformsModule } from "./transform/transforms.module";
import { TransformsService } from "./transform/transforms.service";
import { SystemWideModule } from "./systemwide/systemwide.module";
import { SystemWideService } from "./systemwide/systemwide.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([Metric, Block, Transaction, MetricQuery]),
    HttpModule,
    MetricsSchedulerConfigModule,
    MetricQueryModule,
    MetricQueryDetailsModule,
    TransformsModule,
    SystemWideModule,
  ],
  providers: [
    MetricsService,
    MetricsSchedulerConfigService,
    MetricQueryService,
    MetricQueryDetailsService,
    TransformsService,
    SystemWideService,
  ],
  controllers: [MetricsController],
  exports: [
    MetricsService,
    MetricQueryDetailsService,
    MetricsSchedulerConfigService,
    TransformsService,
    SystemWideService,
  ],
})
export class MetricModule {}
