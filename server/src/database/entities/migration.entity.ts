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

  @Column({ type: 'int', default: null })
  status: number;

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

  @Column({ type: "bytea" })
  manyHash: ArrayBuffer;

  @Column() 
  uuid: string;

  @Column({ nullable: true, default: null })
  manifestDatetime: Date;

  @Column({ nullable: true, default: null })
  manifestHash: string;

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