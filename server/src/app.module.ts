import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { NeighborhoodModule } from './neighborhoods/neighborhood.module';
import { Neighborhood } from './neighborhoods/neighborhood.entity';
import { Block } from './neighborhoods/blocks/block.entity';
import { NetworkService } from './services/network.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { AppConfigModule } from './config/app/configuration.module';
import * as path from 'path';
import { DatabaseConfigModule } from './config/database/configuration.module';
import { DatabaseConfigService } from './config/database/configuration.service';
import { SchedulerConfigModule } from './config/scheduler/configuration.module';
import { SchedulerService } from './services/scheduler.service';
import { ScheduleModule } from '@nestjs/schedule';
import { Transaction } from './database/entities/transaction.entity';

// The root path for all static files.
const staticRootPath = path.join(__dirname, '../..', 'client/build');

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
