import { Logger, Module } from "@nestjs/common";
import { ScheduleModule } from "@nestjs/schedule";
import { ServeStaticModule } from "@nestjs/serve-static";
import { TypeOrmModule } from "@nestjs/typeorm";
import * as path from "path";
import { DataSource } from "typeorm";
import { AppConfigModule } from "./config/app/configuration.module";
import { DatabaseConfigModule } from "./config/database/configuration.module";
import { DatabaseConfigService } from "./config/database/configuration.service";
import { SchedulerConfigModule } from "./config/scheduler/configuration.module";
import { Transaction } from "./database/entities/transaction.entity";
import { Block } from "./neighborhoods/blocks/block.entity";
import { Neighborhood } from "./neighborhoods/neighborhood.entity";
import { NeighborhoodModule } from "./neighborhoods/neighborhood.module";
import { NetworkService } from "./services/network.service";
import { SchedulerService } from "./services/scheduler.service";

// The root path for all static files.
const staticRootPath = path.join(__dirname, "../..", "client/build");

@Module({
  controllers: [],
  providers: [Logger, NetworkService, SchedulerService],
  imports: [
    AppConfigModule,
    NeighborhoodModule,
    SchedulerConfigModule,
    ScheduleModule.forRoot(),
    ServeStaticModule.forRoot({
      rootPath: staticRootPath,
    }),
    TypeOrmModule.forRootAsync({
      imports: [DatabaseConfigModule],
      inject: [DatabaseConfigService],
      useFactory: (db: DatabaseConfigService) => {
        return {
          entities: [Neighborhood, Block, Transaction],
          type: db.type,
          synchronize: true,
          ...db.extras,
        };
      },
    }),
  ],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
