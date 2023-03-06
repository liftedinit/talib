import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Block } from "../../database/entities/block.entity";
import { Transaction } from "../../database/entities/transaction.entity";
import { NetworkService } from "../../services/network.service";
import { TransactionsController } from "./transactions.controller";
import { TransactionsService } from "./transactions.service";

@Module({
  imports: [TypeOrmModule.forFeature([Block, Transaction])],
  providers: [TransactionsService, NetworkService],
  controllers: [TransactionsController],
  exports: [TransactionsService],
})
export class TransactionsModule {}
