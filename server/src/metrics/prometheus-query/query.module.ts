import { Module } from "@nestjs/common";
import { HttpModule } from "@nestjs/axios";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PrometheusQuery } from "../../database/entities/prometheus-query.entity";
import { PrometheusQueryService } from "./query.service";
import { PrometheusQueryController } from "./query.controller";
import { PrometheusQueryDetailsService } from "../prometheus-query-details/query-details.service";
import { PrometheusQueryDetailsController } from "../prometheus-query-details/query-details.controller";

@Module({
  imports: [TypeOrmModule.forFeature([PrometheusQuery]), HttpModule],
  providers: [PrometheusQueryService, PrometheusQueryDetailsService],
  controllers: [PrometheusQueryController, PrometheusQueryDetailsController],
  exports: [PrometheusQueryService],
})
export class PrometheusQueryModule {}
