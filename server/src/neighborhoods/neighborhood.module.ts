import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Block } from "../database/entities/block.entity";
import { Neighborhood } from "../database/entities/neighborhood.entity";
import { Transaction } from "../database/entities/transaction.entity";
import { NetworkService } from "../services/network.service";
import { BlockModule } from "./blocks/block.module";
import { BlockService } from "./blocks/block.service";
import { NeighborhoodController } from "./neighborhood.controller";
import { NeighborhoodService } from "./neighborhood.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([Neighborhood, Block, Transaction]),
    BlockModule,
  ],
  providers: [BlockService, NeighborhoodService, NetworkService],
  controllers: [NeighborhoodController],
  exports: [NeighborhoodService, BlockService],
})
export class NeighborhoodModule {}
