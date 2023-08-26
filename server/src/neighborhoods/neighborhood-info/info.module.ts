import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { NeighborhoodInfo } from "../../database/entities/neighborhood-info.entity";
import { TransactionDetails } from "../../database/entities/transaction-details.entity";
import { Transaction } from "../../database/entities/transaction.entity";
import { NetworkService } from "../../services/network.service";
import { TxAnalyzerService } from "../../services/scheduler/tx-analyzer.service";
import { TransactionsService } from "../transactions/transactions.service";
import { NeighborhoodInfoService } from "./info.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      NeighborhoodInfo,
      Transaction,
      TransactionDetails,
    ]),
  ],
  providers: [
    NeighborhoodInfoService,
    NetworkService,
    TxAnalyzerService,
    TransactionsService,
  ],
  // controllers: [BlockController],
  exports: [NeighborhoodInfoService],
})
export class NeighborhoodInfoModule {}
