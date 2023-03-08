import { Logger, Module } from "@nestjs/common";
import { RouterModule } from "@nestjs/core";
import { ScheduleModule } from "@nestjs/schedule";
import { ServeStaticModule } from "@nestjs/serve-static";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import { AppConfigModule } from "./config/app/configuration.module";
import { AppConfigService } from "./config/app/configuration.service";
import { DatabaseConfigModule } from "./config/database/configuration.module";
import { DatabaseConfigService } from "./config/database/configuration.service";
import { SchedulerConfigModule } from "./config/scheduler/configuration.module";
import { Block } from "./database/entities/block.entity";
import { Neighborhood } from "./database/entities/neighborhood.entity";
import { Transaction } from "./database/entities/transaction.entity";
import { NeighborhoodModule } from "./neighborhoods/neighborhood.module";
import { NetworkService } from "./services/network.service";
import { SchedulerService } from "./services/scheduler.service";

@Module({
  controllers: [],
  providers: [Logger, NetworkService, SchedulerService],
  imports: [
    AppConfigModule,
    NeighborhoodModule,
    RouterModule.register([
      {
        path: "api/v1",
        module: NeighborhoodModule,
      },
    ]),
    SchedulerConfigModule,
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
        entities: [Neighborhood, Block, Transaction],
        migrations: [],
        synchronize: true,
        ...db.config,
      }),
    }),
  ],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
