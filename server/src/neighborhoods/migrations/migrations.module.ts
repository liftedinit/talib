import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Migration } from "../../database/entities/migration.entity";
import { Transaction } from "../../database/entities/transaction.entity";
import { TransactionDetails } from "../../database/entities/transaction-details.entity";
import { NetworkService } from "../../services/network.service";
import { MigrationsController } from "./migrations.controller";
import { MigrationsService } from "./migrations.service";
import { MigrationWhitelist } from "../../database/entities/migration-whitelist.entity";
import { MigrationWhitelistService } from "./migration-whitelist.service";
import { MigrationWhitelistController } from "./migration-whitelist.controller";

@Module({
  imports: [TypeOrmModule.forFeature([Migration, Transaction, TransactionDetails, MigrationWhitelist])],
  providers: [MigrationsService, NetworkService, MigrationWhitelistService],
  controllers: [MigrationsController, MigrationWhitelistController],
  exports: [MigrationsService],
})
export class MigrationsModule {}
