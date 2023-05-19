import { Module } from "@nestjs/common";
import { HttpModule } from "@nestjs/axios";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MetricDetails } from "../database/entities/metric-details.entity";
import { Metric } from "../database/entities/metric.entity";
import { MetricService } from "./metric.service";
import { MetricController } from "./metric.controller";
import { MetricDetailsService } from "./metric-details.ts/metric-details.service";
import { MetricDetailsController } from "./metric-details.ts/metric-details.controller";

@Module({
  imports: [TypeOrmModule.forFeature([Metric, MetricDetails]), HttpModule],
  providers: [MetricService, MetricDetailsService],
  controllers: [MetricController, MetricDetailsController],
  exports: [MetricService],
})
export class MetricModule {}
