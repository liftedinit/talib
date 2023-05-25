import { Module } from "@nestjs/common";
import { HttpModule } from "@nestjs/axios";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Metric } from "../database/entities/metric.entity";
import { MetricService } from "./metric.service";
import { MetricController } from "./metric.controller";
import { MetricDetailsService } from "./metric-details/metric-details.service";
import { MetricDetailsController } from "./metric-details/metric-details.controller";

@Module({
  imports: [TypeOrmModule.forFeature([Metric]), HttpModule],
  providers: [MetricService, MetricDetailsService],
  controllers: [MetricController, MetricDetailsController],
  exports: [MetricService],
})
export class MetricModule {}
