import { Module } from "@nestjs/common";
import { HttpModule } from "@nestjs/axios";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Metric } from "../../database/entities/metric.entity";
import { Block } from "../../database/entities/block.entity";
import { Transaction } from "../../database/entities/transaction.entity";
import { SystemWideService } from "./systemwide.service";
import { SystemWideController } from "./systemwide.controller";
import { MetricQueryService } from "../metric-query/query.service";
import { MetricsService } from "../metrics.service";
import { MetricsSchedulerConfigService } from "src/config/metrics-scheduler/configuration.service";
import { ConfigService } from "@nestjs/config";
import { MetricQuery } from "../../database/entities/metric-query.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([Metric, Block, Transaction, MetricQuery]),
    HttpModule,
  ],
  providers: [
    SystemWideService,
    MetricsService,
    MetricsSchedulerConfigService,
    MetricQueryService,
    ConfigService,
  ],
  controllers: [SystemWideController],
  exports: [SystemWideService],
})
export class SystemWideModule {}
