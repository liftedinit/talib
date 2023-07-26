import { Module } from "@nestjs/common";
import { HttpModule } from "@nestjs/axios";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PrometheusQuery } from "../../database/entities/prometheus-query.entity";
import { Metric } from "../../database/entities/metric.entity";
import { PrometheusQueryService } from "./query.service";
import { PrometheusQueryController } from "./query.controller";
import { PrometheusQueryDetailsService } from "../prometheus-query-details/query-details.service";
import { PrometheusConfigModule } from "../../config/prometheus/configuration.module";
import { PrometheusConfigService } from "../../config/prometheus/configuration.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([Metric, PrometheusQuery]),
    HttpModule,
    PrometheusConfigModule,
  ],
  providers: [
    PrometheusQueryService,
    PrometheusQueryDetailsService,
    PrometheusConfigService,
  ],
  controllers: [PrometheusQueryController],
  exports: [PrometheusQueryService],
})
export class PrometheusQueryModule {}
