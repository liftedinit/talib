import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import {
  TransactionDetailsDto,
  TransactionDto,
  TransactionSimpleDto,
} from "../../dto/transaction.dto";
import { bufferToHex } from "../../utils/convert";
import { Block } from "./block.entity";
import { TransactionDetails } from "./transaction-details.entity";

@Entity()
@Index(["block", "block_index"], { unique: true })
@Index(["block", "hash"], { unique: true })
@Index(["block"])  // For fast JOINs on foreign key
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "integer" })
  block_index: number;

  @Column({ type: "bytea" })
  hash: ArrayBuffer | Buffer | Uint8Array;

  @Column({ type: "bytea" })
  request?: ArrayBuffer | Buffer | Uint8Array;

  @Column({ type: "bytea" })
  response?: ArrayBuffer | Buffer | Uint8Array;

  @ManyToOne(() => Block, (block) => block.transactions, {
    onDelete: "CASCADE",
  })
  @JoinColumn()
  block: Block;

  @OneToOne(() => TransactionDetails, { onDelete: "CASCADE" })
  details: TransactionDetails;

  intoDto(block?: Block): TransactionDto {
    return {
      ...this.intoSimpleDto(),
      blockHash: bufferToHex((block || this.block).hash),
      blockHeight: (block || this.block).height,
      blockIndex: this.block_index,
      dateTime: (block || this.block).time.toISOString(),

      method: this.details?.method,
      argument: this.details?.argument,
      result: this.details?.result,
      error: this.details?.error,
    };
  }

  intoSimpleDto(): TransactionSimpleDto {
    return {
      hash: bufferToHex(this.hash),
    };
  }

  intoDetailsDto(): TransactionDetailsDto {
    return {
      ...this.intoDto(),
      request: bufferToHex(this.request),
      response: bufferToHex(this.response),
    };
  }
}
