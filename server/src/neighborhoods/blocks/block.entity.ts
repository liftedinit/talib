import {
  Column,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Neighborhood } from '../neighborhood.entity';
import { Transaction } from '../../database/entities/transaction.entity';

@Entity()
@Index(['neighborhood', 'height'], { unique: true })
export class Block {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Neighborhood, (neighborhood) => neighborhood.blocks)
  neighborhood: Neighborhood;

  @Column({ name: 'height', type: 'integer', nullable: false })
  height: number;

  @Column({ type: 'blob', nullable: true })
  hash: ArrayBuffer;

  @Column({ type: 'blob', nullable: true })
  appHash: ArrayBuffer;

  @OneToMany(() => Transaction, (tx) => tx.block, {
    onDelete: 'CASCADE',
  })
  transactions: Transaction[];
}
