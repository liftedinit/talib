import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { ARRAYBUFFER_FIELD_TYPE } from "../../utils/database";
import { Transaction } from "./transaction.entity";

@Entity()
export class TransactionDetails {
  @PrimaryGeneratedColumn()
  id: number;

  @Column(ARRAYBUFFER_FIELD_TYPE)
  hash: ArrayBuffer;

  @OneToOne(() => Transaction)
  @JoinColumn()
  transaction: Transaction;

  @Column()
  method: string;

  @Column({ type: "date" })
  timestamp: Date;

  @Column({ type: "simple-json" })
  argument: object;

  @Column({ type: "simple-json", nullable: true })
  result?: any;

  @Column({ type: "simple-json", nullable: true })
  error?: { code: number; message: string; fields: { [name: string]: string } };

  @Column({ nullable: true })
  parseError?: string;
}
