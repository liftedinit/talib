import { Module } from "@nestjs/common";
import { HttpModule } from "@nestjs/axios";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Metric } from "../../database/entities/metric.entity";
import { SystemWideMetric } from "../../database/entities/systemwide-metric.entity";
import { Block } from "../../database/entities/block.entity";
import { Transaction } from "../../database/entities/transaction.entity";
import { SystemWideService } from "./systemwide.service";
import { SystemWideController } from "./systemwide.controller";
import { PrometheusQueryService } from "../prometheus-query/query.service";
import { MetricsService } from "../metrics.service";
import { MetricsSchedulerConfigService } from "src/config/metrics-scheduler/configuration.service";
import { ConfigService } from "@nestjs/config";
import { PrometheusQuery } from "../../database/entities/prometheus-query.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([Metric, SystemWideMetric, Block, Transaction, PrometheusQuery]),
    HttpModule,
  ],
  providers: [
    SystemWideService,
    MetricsService,
    MetricsSchedulerConfigService,
    PrometheusQueryService,
    ConfigService,
  ],
  controllers: [SystemWideController],
  exports: [SystemWideService],
})
export class SystemWideModule {}
