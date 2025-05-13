// src/monitoring/monitoring.module.ts
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";
import { MonitoringService } from './monitoring.service';
import { MonitoringController } from './monitoring.controller';
import { PrometheusQueryModule } from '../prometheus-query/query.module';
import { PrometheusQuery } from '../../database/entities/prometheus-query.entity';
import { MetricsService } from '../metrics.service';
import { Metric } from '../../database/entities/metric.entity';
import { MetricsSchedulerConfigModule } from '../../config/metrics-scheduler/configuration.module';
import { Registry } from 'prom-client';
import { MonitoringMiddleware } from './monitoring.middleware';

@Module({
  imports: [
    TypeOrmModule.forFeature([Metric, PrometheusQuery]),
    PrometheusQueryModule, 
    MetricsSchedulerConfigModule,
  ],
  controllers: [MonitoringController],
  providers: [
    MonitoringService, 
    MetricsService,
    Registry,
  ],
  exports: [MonitoringService, MetricsService],
})
export class MonitoringModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(MonitoringMiddleware)
      .forRoutes('monitoring/metrics');
  }
}