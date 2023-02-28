import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';
import { NeighborhoodModule } from './neighborhoods/neighborhood.module';
import { Neighborhood } from './neighborhoods/neighborhood.entity';
import { Block } from './neighborhoods/blocks/block.entity';
import { NetworkService } from './services/network.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { AppConfigModule } from './config/app/configuration.module';
import * as path from 'path';
import { DatabaseConfigModule } from './config/database/configuration.module';
import { DatabaseConfigService } from './config/database/configuration.service';

// The root path for all static files.
const staticRootPath = path.join(__dirname, '../..', 'client/build');

@Module({
  controllers: [],
  providers: [NetworkService],
  imports: [
    AppConfigModule,
    NeighborhoodModule,
    ServeStaticModule.forRoot({
      rootPath: staticRootPath,
    }),
    TypeOrmModule.forRootAsync({
      imports: [DatabaseConfigModule],
      inject: [DatabaseConfigService],
      useFactory: (db: DatabaseConfigService) => {
        return {
          entities: [Neighborhood, Block],
          type: db.type,
          ...db.extras,
        };
      },
    }),
  ],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
