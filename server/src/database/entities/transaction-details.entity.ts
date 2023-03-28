import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Transaction } from "./transaction.entity";

@Entity()
export class TransactionDetails {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "bytea" })
  hash: ArrayBuffer;

  @OneToOne(() => Transaction, (tx) => tx.details, {
    onDelete: "CASCADE",
  })
  @JoinColumn()
  transaction: Transaction;

  @Column()
  method: string;

  @Column({ type: "date" })
  timestamp: Date;

  @Column({ type: "simple-json", nullable: true })
  argument?: object;

  @Column({ type: "simple-json", nullable: true })
  result?: any;

  @Column({ type: "simple-json", nullable: true })
  error?: { code: number; message: string; fields: { [name: string]: string } };

  @Column({ nullable: true })
  parseError?: string;

  @Column({ type: "simple-json", nullable: true })
  attributes?: any[];

  @Column({ type: "simple-array", nullable: true })
  addresses?: string[];
}
