import { Module } from "@nestjs/common";
import { HttpModule } from "@nestjs/axios";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PrometheusQuery } from "../../database/entities/prometheus-query.entity";
import { Metric } from "../../database/entities/metric.entity";
import { PrometheusQueryDetailsService } from "./query-details.service";
import { PrometheusConfigModule } from "../../config/prometheus/configuration.module";
import { PrometheusConfigService } from "../../config/prometheus/configuration.service";
import { PrometheusQueryDetailsController } from "./query-details.controller";
@Module({
  imports: [
    TypeOrmModule.forFeature([Metric, PrometheusQuery]),
    HttpModule,
    PrometheusConfigModule,
  ],
  providers: [PrometheusConfigService, PrometheusQueryDetailsService],
  controllers: [PrometheusQueryDetailsController],
  exports: [PrometheusQueryDetailsService, PrometheusConfigService],
})
export class PrometheusQueryDetailsModule {}
