import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SchedulerConfigModule } from "../../config/scheduler/configuration.module";
import { SchedulerConfigService } from "../../config/scheduler/configuration.service";
import { Block } from "../../database/entities/block.entity";
import { Neighborhood } from "../../database/entities/neighborhood.entity";
import { TransactionDetails } from "../../database/entities/transaction-details.entity";
import { Transaction } from "../../database/entities/transaction.entity";
import { BlockModule } from "../../neighborhoods/blocks/block.module";
import { BlockService } from "../../neighborhoods/blocks/block.service";
import { NeighborhoodModule } from "../../neighborhoods/neighborhood.module";
import { TransactionsModule } from "../../neighborhoods/transactions/transactions.module";
import { NetworkService } from "../network.service";
import { SchedulerController } from "./scheduler.controller";
import { SchedulerService } from "./scheduler.service";
import { TxAnalyzerService } from "./tx-analyzer.service";

@Module({
  controllers: [SchedulerController],
  imports: [
    TypeOrmModule.forFeature([
      Neighborhood,
      Block,
      Transaction,
      TransactionDetails,
    ]),
    BlockModule,
    NeighborhoodModule,
    SchedulerConfigModule,
    TransactionsModule,
  ],
  providers: [
    SchedulerConfigService,
    BlockService,
    NetworkService,
    SchedulerService,
    TxAnalyzerService,
  ],
  exports: [SchedulerService],
})
export class SchedulerModule {}
