import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Block } from "../database/entities/block.entity";
import { Neighborhood } from "../database/entities/neighborhood.entity";
import { NeighborhoodInfo } from "../database/entities/neighborhood-info.entity";
import { TransactionDetails } from "../database/entities/transaction-details.entity";
import { Transaction } from "../database/entities/transaction.entity";
import { NetworkService } from "../services/network.service";
import { TxAnalyzerService } from "../services/scheduler/tx-analyzer.service";
import { AddressesModule } from "./addresses/addresses.module";
import { BlockModule } from "./blocks/block.module";
import { BlockService } from "./blocks/block.service";
import { EventsModule } from "./events/events.module";
import { NeighborhoodController } from "./neighborhood.controller";
import { NeighborhoodService } from "./neighborhood.service";
import { TransactionsModule } from "./transactions/transactions.module";
import { NeighborhoodInfoModule } from "./neighborhood-info/info.module";
import { NeighborhoodInfoService } from "./neighborhood-info/info.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Neighborhood,
      NeighborhoodInfo,
      Block,
      Transaction,
      TransactionDetails,
    ]),
    BlockModule,
    NeighborhoodInfoModule,
    TransactionsModule,
    EventsModule,
    AddressesModule,
  ],
  providers: [
    BlockService,
    NeighborhoodService,
    NeighborhoodInfoService,
    NetworkService,
    TxAnalyzerService,
  ],
  controllers: [NeighborhoodController],
  exports: [NeighborhoodService, BlockService, NeighborhoodInfoService],
})
export class NeighborhoodModule {}
