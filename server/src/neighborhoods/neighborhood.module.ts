import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { NetworkService } from "../services/network.service";
import { Block } from "./blocks/block.entity";
import { BlockService } from "./blocks/block.service";
import { NeighborhoodController } from "./neighborhood.controller";
import { Neighborhood } from "./neighborhood.entity";
import { NeighborhoodService } from "./neighborhood.service";

@Module({
  imports: [TypeOrmModule.forFeature([Neighborhood, Block])],
  providers: [NeighborhoodService, BlockService, NetworkService],
  controllers: [NeighborhoodController],
  exports: [NeighborhoodService, BlockService, NetworkService],
})
export class NeighborhoodModule {}
