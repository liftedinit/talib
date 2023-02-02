import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NeighborhoodService } from './neighborhood.service';
import { NeighborhoodController } from './neighborhood.controller';
import { Neighborhood } from './neighborhood.entity';
import { BlockService } from './blocks/block.service';
import { Block } from './blocks/block.entity';
import { NetworkService } from '../services/network.service';

@Module({
  imports: [TypeOrmModule.forFeature([Neighborhood, Block])],
  providers: [NeighborhoodService, BlockService, NetworkService],
  controllers: [NeighborhoodController],
})
export class NeighborhoodModule {}
