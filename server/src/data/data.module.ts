import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Block } from "../database/entities/block.entity";
import { Neighborhood } from "../database/entities/neighborhood.entity";
import { TransactionDetails } from "../database/entities/transaction-details.entity";
import { Transaction } from "../database/entities/transaction.entity";
import { DataController } from "./data.controller";

@Module({
  controllers: [DataController],
  imports: [
    TypeOrmModule.forFeature([
      Neighborhood,
      Block,
      Transaction,
      TransactionDetails,
    ]),
  ],
})
export class DataModule {}
