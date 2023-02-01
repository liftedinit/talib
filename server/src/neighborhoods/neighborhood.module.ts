import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NeighborhoodService } from './neighborhood.service';
import { NeighborhoodController } from './neighborhood.controller';
import { Neighborhood } from './neighborhood.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Neighborhood])],
  providers: [NeighborhoodService],
  controllers: [NeighborhoodController],
})
export class NeighborhoodModule {}
