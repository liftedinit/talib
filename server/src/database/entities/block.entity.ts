import {
  Column,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { BlockDetailsDto, BlockDto } from "../../dto/block.dto";
import { bufferToHex } from "../../utils/convert";
import { ARRAYBUFFER_FIELD_TYPE } from "../../utils/database";
import { Neighborhood } from "./neighborhood.entity";
import { Transaction } from "./transaction.entity";

@Entity()
@Index(["neighborhood", "height"], { unique: true })
@Index(["height"])
export class Block {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Neighborhood, (neighborhood) => neighborhood.blocks)
  neighborhood: Neighborhood;

  @Column({ name: "height", type: "integer", nullable: false })
  height: number;

  @Column()
  time: Date;

  @Column(ARRAYBUFFER_FIELD_TYPE)
  hash: ArrayBuffer;

  @Column(ARRAYBUFFER_FIELD_TYPE)
  appHash?: ArrayBuffer;

  @OneToMany(() => Transaction, (tx) => tx.block, {
    onDelete: "CASCADE",
  })
  transactions: Transaction[];

  txCount?: number;

  intoDto(): BlockDto {
    return {
      height: this.height,
      dateTime: this.time.toISOString(),
      appHash: bufferToHex(this.appHash),
      blockHash: bufferToHex(this.hash),
      txCount: this.txCount,
    };
  }

  intoDetailsDto(): BlockDetailsDto {
    return {
      ...this.intoDto(),
      transactions: this.transactions?.map((t) => t.intoSimpleDto()),
    };
  }
}
