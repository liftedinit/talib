import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Block } from "../../database/entities/block.entity";
import { TransactionDetails } from "../../database/entities/transaction-details.entity";
import { Transaction } from "../../database/entities/transaction.entity";
import { NetworkService } from "../../services/network.service";
import { TxAnalyzerService } from "../../services/scheduler/tx-analyzer.service";
import { TransactionsService } from "../transactions/transactions.service";
import { AddressesController } from "./addresses.controller";
import { AddressesService } from "./addresses.service";

@Module({
  imports: [TypeOrmModule.forFeature([Block, Transaction, TransactionDetails])],
  providers: [
    AddressesService,
    NetworkService,
    TxAnalyzerService,
    TransactionsService,
  ],
  controllers: [AddressesController],
  exports: [AddressesService],
})
export class AddressesModule {}
