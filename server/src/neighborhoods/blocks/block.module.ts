import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Block } from "../../database/entities/block.entity";
import { Transaction } from "../../database/entities/transaction.entity";
import { NetworkService } from "../../services/network.service";
import { BlockController } from "./block.controller";
import { BlockService } from "./block.service";

@Module({
  imports: [TypeOrmModule.forFeature([Block, Transaction])],
  providers: [BlockService, NetworkService],
  controllers: [BlockController],
  exports: [BlockService],
})
export class BlockModule {}
