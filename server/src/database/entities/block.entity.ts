import {
  Column,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { BlockDto } from "../../dto/block.dto";
import { bufferToHex } from "../../utils/convert";
import { Neighborhood } from "./neighborhood.entity";
import { Transaction } from "./transaction.entity";

@Entity()
@Index(["neighborhood", "height"], { unique: true })
export class Block {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Neighborhood, (neighborhood) => neighborhood.blocks)
  neighborhood: Neighborhood;

  @Column({ name: "height", type: "integer", nullable: false })
  height: number;

  @Column({ type: "blob", nullable: true })
  hash: ArrayBuffer;

  @Column({ type: "blob", nullable: true })
  appHash: ArrayBuffer;

  @OneToMany(() => Transaction, (tx) => tx.block, {
    onDelete: "CASCADE",
  })
  transactions: Transaction[];

  txCount?: number;

  intoDto(): BlockDto {
    return {
      height: this.height,
      appHash: bufferToHex(this.appHash),
      blockHash: bufferToHex(this.hash),
      txCount: this.txCount,
    };
  }
}
