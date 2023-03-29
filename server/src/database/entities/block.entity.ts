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
import { Neighborhood } from "./neighborhood.entity";
import { Transaction } from "./transaction.entity";

@Entity()
@Index(["neighborhood", "height"], { unique: true })
export class Block {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Neighborhood, (neighborhood) => neighborhood.blocks, {
    onDelete: "CASCADE",
  })
  neighborhood: Neighborhood;

  @Column({ name: "height", type: "integer", nullable: false })
  height: number;

  @Column()
  time: Date;

  @Column({ type: "bytea" })
  hash: ArrayBuffer;

  @Column({ type: "bytea" })
  appHash?: ArrayBuffer;

  @OneToMany(() => Transaction, (tx) => tx.block, {
    onDelete: "CASCADE",
  })
  transactions: Transaction[];

  txCount?: number;

  static export(row: any) {
    return {
      ...row,
      hash: bufferToHex(row.hash),
      appHash: bufferToHex(row.appHash),
    };
  }

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
    console.log(this);
    return {
      ...this.intoDto(),
      transactions: this.transactions?.map((t) => t.intoDto(this)),
    };
  }
}
