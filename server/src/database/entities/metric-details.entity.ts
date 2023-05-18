import {
  Column,
  Entity,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Metric } from "./metric.entity";

@Entity()
export class MetricDetails {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  timestamp: Date;

  @Column()
  body: string;

  @ManyToOne(() => Metric, (metric) => metric.id, {
    onDelete: "CASCADE",
  })
  @JoinColumn()
  metric: Metric;
}

// public intoDetailsDto(): MetricDetailsDto {
//     const currentTime = new Date();
//     return {
//       ...this.intoDto(),
//       timestamp: currentTime,
//       body: this.body,
//     };
//   }
