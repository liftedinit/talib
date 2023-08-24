import { Logger, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ScheduleModule } from "@nestjs/schedule";
import { ServeStaticModule } from "@nestjs/serve-static";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import { AuthModule } from "./auth/auth.module";
import { AdminConfigModule } from "./config/admin/configuration.module";
import { AppConfigModule } from "./config/app/configuration.module";
import { AppConfigService } from "./config/app/configuration.service";
import { DatabaseConfigModule } from "./config/database/configuration.module";
import { DatabaseConfigService } from "./config/database/configuration.service";
import { SchedulerConfigModule } from "./config/scheduler/configuration.module";
import { DataModule } from "./data/data.module";
import { Block } from "./database/entities/block.entity";
import { NeighborhoodInfo } from "./database/entities/neighborhood-info.entity";
import { Event } from "./database/entities/event.entity";
import { Neighborhood } from "./database/entities/neighborhood.entity";
import { TransactionDetails } from "./database/entities/transaction-details.entity";
import { Transaction } from "./database/entities/transaction.entity";
import { NeighborhoodModule } from "./neighborhoods/neighborhood.module";
import { NetworkService } from "./services/network.service";
import { SchedulerModule } from "./services/scheduler/scheduler.module";
import { MetricsSchedulerModule } from "./services/metrics-scheduler/metrics-scheduler.module";
import { MetricsSchedulerConfigModule } from "./config/metrics-scheduler/configuration.module";
import { PrometheusQuery } from "./database/entities/prometheus-query.entity";
import { PrometheusQueryModule } from "./metrics/prometheus-query/query.module";
import { UsersModule } from "./users/users.module";
import { Metric } from "./database/entities/metric.entity";
import { MetricModule } from "./metrics/metrics.module";

@Module({
  controllers: [],
  providers: [Logger, NetworkService],
  imports: [
    AppConfigModule,
    NeighborhoodModule,
    PrometheusQueryModule,
    SchedulerConfigModule,
    MetricsSchedulerConfigModule,
    ConfigModule.forRoot(),
    ScheduleModule.forRoot(),
    ServeStaticModule.forRootAsync({
      imports: [AppConfigModule],
      inject: [AppConfigService],
      useFactory: (app: AppConfigService) => {
        const logger = new Logger("ServeStaticModule");
        const rootPath = app.staticRootPath;
        logger.debug(`Static root path: ${rootPath}`);

        return rootPath
          ? [
              {
                rootPath,
                exclude: ["/api/(.*)"],
              },
            ]
          : [];
      },
    }),

    TypeOrmModule.forRootAsync({
      imports: [DatabaseConfigModule],
      inject: [DatabaseConfigService],
      useFactory: (db: DatabaseConfigService) => ({
        entities: [Neighborhood, Block, NeighborhoodInfo, Event, Transaction, TransactionDetails, PrometheusQuery, Metric],
        migrations: [],
        synchronize: true,
        ...db.config,
      }),
    }),
    TypeOrmModule.forFeature([Event, Transaction, TransactionDetails, PrometheusQuery, Metric]),
    AdminConfigModule,
    AppConfigModule,
    SchedulerConfigModule,
    MetricsSchedulerConfigModule,
    AuthModule,
    DataModule,
    NeighborhoodModule,
    MetricModule,
    SchedulerModule,
    MetricsSchedulerModule,
    UsersModule,
  ],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
