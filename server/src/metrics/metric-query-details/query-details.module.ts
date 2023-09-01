import { Module } from "@nestjs/common";
import { HttpModule } from "@nestjs/axios";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MetricQuery } from "../../database/entities/metric-query.entity";
import { Metric } from "../../database/entities/metric.entity";
import { MetricQueryDetailsService } from "./query-details.service";
import { PrometheusConfigModule } from "../../config/prometheus/configuration.module";
import { PrometheusConfigService } from "../../config/prometheus/configuration.service";
@Module({
  imports: [
    TypeOrmModule.forFeature([Metric, MetricQuery]),
    HttpModule,
    PrometheusConfigModule,
  ],
  providers: [PrometheusConfigService, MetricQueryDetailsService],
  controllers: [],
  exports: [MetricQueryDetailsService, PrometheusConfigService],
})
export class MetricQueryDetailsModule {}
