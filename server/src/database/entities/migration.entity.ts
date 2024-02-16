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

import { MigrationDto } from "../../dto/migration.dto";
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

  @Column({ type: "bytea", nullable: true })
  manyHash: ArrayBuffer;

  @Column({ nullable: true, default: null })
  manifestDatetime: Date;

  @Column({ nullable: true })
  manifestHash: string;

  @Column() 
  uuid: string;

  intoDto(): MigrationDto {
    return {
      status: this.status,
      uuid: this.uuid,
      manyHash: bufferToHex(this.manyHash),
      manifestDatetime: this.manifestDatetime,
      manifestHash: this.manifestHash,
    };
  }

}