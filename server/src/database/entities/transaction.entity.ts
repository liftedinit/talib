import {
  Column,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { ARRAYBUFFER_FIELD_TYPE } from "../../utils/database";
import { Block } from "./block.entity";

@Entity()
@Index(["block", "block_index"], { unique: true })
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "integer" })
  block_index: number;

  @Column(ARRAYBUFFER_FIELD_TYPE)
  request?: ArrayBuffer;

  @Column(ARRAYBUFFER_FIELD_TYPE)
  response?: ArrayBuffer;

  @ManyToOne(() => Block, (block) => block.transactions)
  block: Block;
}
