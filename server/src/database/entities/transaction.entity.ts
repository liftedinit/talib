import {
  Column,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import {
  TransactionDto,
  TransactionSimpleDto,
} from "../../dto/transaction.dto";
import { bufferToHex } from "../../utils/convert";
import { ARRAYBUFFER_FIELD_TYPE } from "../../utils/database";
import { Block } from "./block.entity";

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

  intoDto(): TransactionDto {
    return {
      ...this.intoSimpleDto(),
      blockHash: bufferToHex(this.block.hash),
      blockHeight: this.block.height,
      blockIndex: this.block_index,
      dateTime: this.block.time.toISOString(),
    };
  }

  intoSimpleDto(): TransactionSimpleDto {
    return {
      hash: bufferToHex(this.hash),
      request: bufferToHex(this.request),
      response: bufferToHex(this.response),
    };
  }
}
