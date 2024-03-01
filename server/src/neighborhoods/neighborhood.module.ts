import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Token } from "../database/entities/token.entity";
import { Migration } from "../database/entities/migration.entity";
import { Block } from "../database/entities/block.entity";
import { Neighborhood } from "../database/entities/neighborhood.entity";
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
import { MigrationsService } from "./migrations/migrations.service";
import { MigrationsModule } from "./migrations/migrations.module";
import { MigrationAnalyzerService } from "../services/scheduler/migration-analyzer.service";
import { TokensModule } from "./tokens/tokens.module";
import { TokensService } from "./tokens/tokens.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Neighborhood,
      Block,
      Event,
      Transaction,
      TransactionDetails,
      Migration,
      Token,
    ]),
    BlockModule,
    TransactionsModule,
    EventsModule,
    AddressesModule,
    MigrationsModule,
    TokensModule
  ],
  providers: [
    BlockService,
    NeighborhoodService,
    NetworkService,
    TxAnalyzerService,
    MigrationAnalyzerService,
    MigrationsService,
    TokensService,
  ],
  controllers: [NeighborhoodController],
  exports: [NeighborhoodService, BlockService],
})
export class NeighborhoodModule {}
