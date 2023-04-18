import { Module, Provider } from "@nestjs/common";
import { ModuleRef } from "@nestjs/core";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SchedulerConfigModule } from "../../config/scheduler/configuration.module";
import { SchedulerConfigService } from "../../config/scheduler/configuration.service";
import { Block } from "../../database/entities/block.entity";
import { Event } from "../../database/entities/event.entity";
import { Neighborhood } from "../../database/entities/neighborhood.entity";
import { TransactionDetails } from "../../database/entities/transaction-details.entity";
import { Transaction } from "../../database/entities/transaction.entity";
import { BlockModule } from "../../neighborhoods/blocks/block.module";
import { BlockService } from "../../neighborhoods/blocks/block.service";
import { EventsService } from "../../neighborhoods/events/events.service";
import { NeighborhoodModule } from "../../neighborhoods/neighborhood.module";
import { TransactionsModule } from "../../neighborhoods/transactions/transactions.module";
import { NetworkService } from "../network.service";
import { NeighborhoodUpdater } from "./neighborhood-updater/updater";
import { SchedulerController } from "./scheduler.controller";
import { SchedulerService } from "./scheduler.service";
import { TxAnalyzerService } from "./tx-analyzer.service";

export const myServiceProvider: Provider = {
  provide: "NEIGHBORHOOD_FACTORY",
  inject: [ModuleRef],
  useFactory: (m: ModuleRef) => async (n: Neighborhood) =>
    (await m.create(NeighborhoodUpdater)).with(n),
};

@Module({
  controllers: [SchedulerController],
  imports: [
    TypeOrmModule.forFeature([
      Neighborhood,
      Block,
      Event,
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
    EventsService,
    NetworkService,
    SchedulerService,
    TxAnalyzerService,
    myServiceProvider,
  ],
  exports: [SchedulerService],
})
export class SchedulerModule {}
