import {
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Transaction } from "./transaction.entity";
import { TransactionDetails } from "./transaction-details.entity"
import { MigrationDto, MigrationDetailsDto, UpdateMigrationDto } from "../../dto/migration.dto";
import { bufferToHex } from "../../utils/convert";

@Entity()
export class Migration {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: null })
  status: string;

  @OneToOne(() => Transaction, {
    onDelete: "CASCADE",
  })
  @JoinColumn()
  transaction: Transaction;

  @OneToOne(() => TransactionDetails, {
    onDelete: "CASCADE",
  })
  @JoinColumn()
  details: TransactionDetails;

  @Column({ nullable: true, default: null })
  migrationDatetime: Date;

  @Column({ type: "bytea", nullable: true })
  hash: ArrayBuffer;

  @Column() 
  uuid: string;

  intoDto(): MigrationDto {
    return {
      hash: bufferToHex(this.hash),
      status: this.status,
      uuid: this.uuid,
      migrationDatetime: this.migrationDatetime,
    };
  }

  updateMigrationDto(): UpdateMigrationDto {
    return {
      ...this.intoDto,
      status: this.status,
      migrationDatetime: this.migrationDatetime,
    }
  }

  intoDetailsDto(): MigrationDetailsDto {
    return {
      ...this.intoDto(),
      details: this.details
    };
  }

}