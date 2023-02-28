import {
  Column,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Neighborhood } from '../neighborhood.entity';

@Entity()
@Index(['neighborhood', 'height'], { unique: true })
export class Block {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Neighborhood, (neighborhood) => neighborhood.blocks)
  neighborhood: Neighborhood;

  @Column({ name: 'height' })
  height: number;

  @Column('blob')
  hash: ArrayBuffer;

  @Column('blob')
  appHash: ArrayBuffer;
}
