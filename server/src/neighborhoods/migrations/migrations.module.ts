import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Migration } from "../../database/entities/migration.entity";
import { Transaction } from "../../database/entities/transaction.entity";
import { TransactionDetails } from "../../database/entities/transaction-details.entity";
import { NetworkService } from "../../services/network.service";
import { MigrationsController } from "./migrations.controller";
import { MigrationsService } from "./migrations.service";

@Module({
  imports: [TypeOrmModule.forFeature([Migration, Transaction, TransactionDetails])],
  providers: [MigrationsService, NetworkService],
  controllers: [MigrationsController],
  exports: [MigrationsService],
})
export class MigrationsModule {}
