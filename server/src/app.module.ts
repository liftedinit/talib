import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';
import { NeighborhoodModule } from './neighborhoods/neighborhood.module';
import { Neighborhood } from './neighborhoods/neighborhood.entity';
import { Block } from './neighborhoods/blocks/block.entity';
import { NetworkService } from './services/network.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as path from 'path';

// Depending on the environment we define what data source we should use
// in the database.
// In development, we want to use SQLite.
// In production, we likely want to use Postgres.
const databaseDetails: { [env: string]: DataSourceOptions } = {
  dev: {
    type: 'sqlite',
    database: process.env.DATABASE || 'talib.sqlite',
    synchronize: true,
  },
};

// The root path for all static files.
const staticRootPath = path.join(__dirname, '../..', 'client/build');

@Module({
  controllers: [],
  providers: [NetworkService],
  imports: [
    NeighborhoodModule,
    ServeStaticModule.forRoot({
      rootPath: staticRootPath,
    }),
    TypeOrmModule.forRoot({
      entities: [Neighborhood, Block],
      ...databaseDetails['dev'],
    }),
  ],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
