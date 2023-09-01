import { Module } from "@nestjs/common";
import { HttpModule } from "@nestjs/axios";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MetricQuery } from "../../database/entities/metric-query.entity";
import { Metric } from "../../database/entities/metric.entity";
import { MetricQueryService } from "./query.service";
import { MetricQueryController } from "./query.controller";
import { MetricQueryDetailsService } from "../metric-query-details/query-details.service";
import { PrometheusConfigModule } from "../../config/prometheus/configuration.module";
import { PrometheusConfigService } from "../../config/prometheus/configuration.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([Metric, MetricQuery]),
    HttpModule,
    PrometheusConfigModule,
  ],
  providers: [
    MetricQueryService,
    MetricQueryDetailsService,
    PrometheusConfigService,
  ],
  controllers: [MetricQueryController],
  exports: [MetricQueryService],
})
export class MetricQueryModule {}
