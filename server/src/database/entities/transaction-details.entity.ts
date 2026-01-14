import { Address } from "@liftedinit/many-js";
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Transaction } from "./transaction.entity";

@Entity()
@Index(['transaction'])  // For JOIN queries on transaction
@Index(['method'])       // For filtering by method
@Index(['sender'])       // For address filtering queries
@Index('idx_td_has_details', ['transaction'], {
  where: '"argument" IS NOT NULL OR "result" IS NOT NULL OR "error" IS NOT NULL'
})  // Partial index for finding transactions with details (used by NOT EXISTS query)
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

  @Column({
    type: 'json',
    nullable: true,
    transformer: {
      from: (value) => {
        // Ensure amount is a string
        if (value?.amount) {
          value.amount = value.amount.toString();
        }
        return value;
      },
      to: (value) => {
        return value;
      },
    },
  })
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
