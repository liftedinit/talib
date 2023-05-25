import { Module } from "@nestjs/common";
import { HttpModule } from "@nestjs/axios";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PrometheusQuery } from "../../database/entities/prometheus-query.entity";
import { PrometheusQueryDetailsService } from "./query-details.service";
import { PrometheusQueryDetailsController } from "./query-details.controller";

@Module({
  imports: [TypeOrmModule.forFeature([PrometheusQuery]), HttpModule],
  providers: [PrometheusQueryDetailsService],
  controllers: [PrometheusQueryDetailsController],
})
export class PrometheusQueryDetailsModule {}
