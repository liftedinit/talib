import {
  Column,
  Entity,
  Index,
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
import { ARRAYBUFFER_FIELD_TYPE } from "../../utils/database";
import { Block } from "./block.entity";
import { TransactionDetails } from "./transaction-details.entity";

@Entity()
@Index(["block", "block_index"], { unique: true })
@Index(["block", "hash"], { unique: true })
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "integer" })
  block_index: number;

  @Column(ARRAYBUFFER_FIELD_TYPE)
  hash: ArrayBuffer;

  @Column(ARRAYBUFFER_FIELD_TYPE)
  request?: ArrayBuffer;

  @Column(ARRAYBUFFER_FIELD_TYPE)
  response?: ArrayBuffer;

  @ManyToOne(() => Block, (block) => block.transactions)
  block: Block;

  @OneToOne(() => TransactionDetails)
  details: TransactionDetails;

  intoDto(): TransactionDto {
    return {
      ...this.intoSimpleDto(),
      blockHash: bufferToHex(this.block.hash),
      blockHeight: this.block.height,
      blockIndex: this.block_index,
      dateTime: this.block.time.toISOString(),

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
