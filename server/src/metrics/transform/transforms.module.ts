import { Module } from "@nestjs/common";
import { HttpModule } from "@nestjs/axios";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Metric } from "../../database/entities/metric.entity";
import { Block } from "../../database/entities/block.entity";
import { MetricQuery } from "../../database/entities/metric-query.entity";
import { TransformsService } from "./transforms.service";
import { TransformsController } from "./trasforms.controller";
import { MetricQueryDetailsModule } from "../metric-query-details/query-details.module";
import { MetricQueryService } from "../metric-query/query.service";
import { MetricsService } from "../metrics.service";
import { MetricsSchedulerConfigService } from "src/config/metrics-scheduler/configuration.service";
import { ConfigService } from "@nestjs/config";

@Module({
  imports: [
    TypeOrmModule.forFeature([Metric, Block, MetricQuery]),
    HttpModule,
    MetricQueryDetailsModule,
  ],
  providers: [
    TransformsService,
    MetricQueryService,
    MetricsService,
    MetricsSchedulerConfigService,
    ConfigService,
  ],
  controllers: [TransformsController],
  exports: [TransformsService],
})
export class TransformsModule {}
