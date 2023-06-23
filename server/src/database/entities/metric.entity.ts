import {
  Column,
  Entity,
  OneToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
} from "typeorm";
import { MetricDto } from "../../dto/metric.dto";
import { PrometheusQuery } from "./prometheus-query.entity";

@Entity()
export class Metric {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => PrometheusQuery, (prometheusQuery) => prometheusQuery.id, {
    nullable: true,
  })
  @JoinColumn()
  prometheusQueryId: PrometheusQuery;

  @Column({ unique: true })
  metricId: ArrayBuffer;

  @Column()
  timestamp: Date;

  @Column({ nullable: true })
  data?: string;

  intoDto(): MetricDto {
    return {
      id: this.id,
      dateTime: this.timestamp.toISOString(),
      prometheusQueryId: this.prometheusQueryId.id,
      data: this.data,
    };
  }
}
