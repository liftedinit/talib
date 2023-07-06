import { Module } from "@nestjs/common";
import { HttpModule } from "@nestjs/axios";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PrometheusQuery } from "../../database/entities/prometheus-query.entity";
import { PrometheusQueryDetailsService } from "./query-details.service";
import { PrometheusConfigModule } from "../../config/prometheus/configuration.module";
import { PrometheusConfigService } from "../../config/prometheus/configuration.service";
@Module({
  imports: [
    TypeOrmModule.forFeature([PrometheusQuery]),
    HttpModule,
    PrometheusConfigModule,
  ],
  providers: [PrometheusConfigService, PrometheusQueryDetailsService],
  controllers: [],
  exports: [PrometheusQueryDetailsService, PrometheusConfigService],
})
export class PrometheusQueryDetailsModule {}
