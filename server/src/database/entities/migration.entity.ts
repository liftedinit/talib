import {
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Transaction } from "./transaction.entity";
import { MigrationDto, MigrationDetailsDto, UpdateMigrationDto } from "../../dto/migration.dto";

@Entity()
export class Migration {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: null })
  status: boolean;

  @OneToOne(() => Transaction, {
    onDelete: "CASCADE",
  })
  @JoinColumn()
  transaction: Transaction;

  @Column({ nullable: true })
  migrationDatetime: Date;

  @Column({ type: "bytea" })
  hash: ArrayBuffer;

  intoDto(): MigrationDto {
    return {
      hash: this.transaction.hash.toString(),

    };
  }

  intoMigratedDto(): UpdateMigrationDto {
    return {
      ...this.intoDto,
      status: this.status,
      migrationDatetime: this.migrationDatetime,
    }
  }

  intoDetailsDto(): MigrationDetailsDto {
    return {
      ...this.intoMigratedDto(),
      ...this.intoMigratedDto,
      transaction: this.transaction?.intoDetailsDto()
    };
  }

}