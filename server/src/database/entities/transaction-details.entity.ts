import { Address } from "@liftedinit/many-js";
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

  @Column()
  timestamp: Date;

  @Column({
    name: "sender",
    type: "varchar",
    nullable: true,
    transformer: {
      from: (value) => (value ? Address.fromString(value) : undefined),
      to: (value) => (value ? value.toString() : undefined),
    },
  })
  sender?: Address;

  @Column({ type: "json", nullable: true })
  argument?: object;

  @Column({ type: "json", nullable: true })
  result?: any;

  @Column({ type: "json", nullable: true })
  error?: { code: number; message: string; fields: { [name: string]: string } };

  @Column({ type: "text", nullable: true })
  parseError?: string;

  @Column({ type: "simple-json", array: true, default: [] })
  attributes: any[];

  @Column({ type: "text", array: true, default: [] })
  addresses: string[];
}
