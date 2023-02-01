import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';
import { NeighborhoodModule } from './neighborhoods/neighborhood.module';
import { Neighborhood } from './neighborhoods/neighborhood.entity';

///
const databaseDetails: { [env: string]: DataSourceOptions } = {
  dev: {
    type: 'sqlite',
    database: 'talib.sqlite',
    synchronize: true,
  },
};

@Module({
  controllers: [],
  providers: [],
  imports: [
    NeighborhoodModule,
    TypeOrmModule.forRoot({
      entities: [Neighborhood],
      ...databaseDetails['dev'],
    }),
  ],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
