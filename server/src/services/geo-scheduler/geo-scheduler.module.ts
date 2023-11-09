import { Module, Provider } from "@nestjs/common";
import { ModuleRef } from "@nestjs/core";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Location } from "../../database/entities/location.entity";
import { GeoSchedulerController } from "./geo-scheduler.controller";
import { GeoSchedulerService } from "./geo-scheduler.service";
import { PrometheusQueryService } from "../../metrics/prometheus-query/query.service";
import { PrometheusQuery } from "../../database/entities/prometheus-query.entity";
import { GeoUpdater } from "./geo-updater/updater";
import { GeoSchedulerConfigModule } from "../../config/geo-scheduler/configuration.module";
import { GeoSchedulerConfigService } from "../../config/geo-scheduler/configuration.service";
import { PrometheusQueryDetailsService } from "../../metrics/prometheus-query-details/query-details.service";
import { PrometheusQueryDetailsModule } from "../../metrics/prometheus-query-details/query-details.module";
import { PrometheusQueryModule } from "../../metrics/prometheus-query/query.module";
import { HttpModule } from "@nestjs/axios";
import { PrometheusQueries } from "./geo-scheduler.service";
import { Metric } from "../../database/entities/metric.entity";

export const myServiceProvider: Provider = {
  provide: "PROMETHEUS_QUERIES_FACTORY",
  inject: [ModuleRef],
  useFactory: (m: ModuleRef) => async (p: PrometheusQueries) =>
    (await m.create(GeoUpdater)).with(p),
};

@Module({
  controllers: [GeoSchedulerController],
  imports: [
    TypeOrmModule.forFeature([Location, PrometheusQuery, Metric]),
    PrometheusQueryModule,
    PrometheusQueryDetailsModule,
    HttpModule,
    GeoSchedulerConfigModule,
  ],
  providers: [
    GeoSchedulerConfigService,
    GeoSchedulerService,
    PrometheusQueryService,
    PrometheusQueryDetailsService,
    myServiceProvider,
  ],
  exports: [GeoSchedulerService],
})
export class GeoSchedulerModule {}
