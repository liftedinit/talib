import {
  Column,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Block } from '../../neighborhoods/blocks/block.entity';

@Entity()
@Index(['block', 'block_index'], { unique: true })
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'integer' })
  block_index: number;

  @Column({ type: 'blob', nullable: false })
  request: ArrayBuffer;

  @Column({ type: 'blob', nullable: false })
  response: ArrayBuffer;

  @ManyToOne(() => Block, (block) => block.transactions)
  block: Block;
}
