import { Module } from "@nestjs/common";
import { HttpModule } from "@nestjs/axios";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Metric } from "../../database/entities/metric.entity";
import { MetricDetails } from "../../database/entities/metric-details.entity";
import { MetricDetailsService } from "./metric-details.service";
import { MetricDetailsController } from "./metric-details.controller";

@Module({
  imports: [TypeOrmModule.forFeature([Metric, MetricDetails]), HttpModule],
  providers: [MetricDetailsService],
  controllers: [MetricDetailsController],
})
export class MetricDetailsModule {}
