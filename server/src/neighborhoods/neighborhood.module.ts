import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Block } from "../database/entities/block.entity";
import { Neighborhood } from "../database/entities/neighborhood.entity";
import { TransactionDetails } from "../database/entities/transaction-details.entity";
import { Transaction } from "../database/entities/transaction.entity";
import { NetworkService } from "../services/network.service";
import { TxAnalyzerService } from "../services/scheduler/tx-analyzer.service";
import { AddressesModule } from "./addresses/addresses.module";
import { BlockModule } from "./blocks/block.module";
import { BlockService } from "./blocks/block.service";
import { NeighborhoodController } from "./neighborhood.controller";
import { NeighborhoodService } from "./neighborhood.service";
import { TransactionsModule } from "./transactions/transactions.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Neighborhood,
      Block,
      Transaction,
      TransactionDetails,
    ]),
    BlockModule,
    TransactionsModule,
    AddressesModule,
  ],
  providers: [
    BlockService,
    NeighborhoodService,
    NetworkService,
    TxAnalyzerService,
  ],
  controllers: [NeighborhoodController],
  exports: [NeighborhoodService, BlockService],
})
export class NeighborhoodModule {}
