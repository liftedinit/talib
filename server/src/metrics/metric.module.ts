import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MetricDetails } from "../database/entities/metric-details.entity";
import { Metric } from "../database/entities/metric.entity";
import { MetricService } from "./metric.service";
import { MetricController } from "./metric.controller";

@Module({
  imports: [TypeOrmModule.forFeature([Metric, MetricDetails])],
  providers: [MetricService],
  controllers: [MetricController],
  exports: [MetricService],
})
export class MetricModule {}
