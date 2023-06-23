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

  @OneToOne(() => PrometheusQuery, (prometheusQuery) => prometheusQuery.name, {
    nullable: true,
  })
  @JoinColumn()
  prometheusQueryName: PrometheusQuery;

  @Column({ type: "timestamptz" })
  timestamp: Date;

  @Column({ nullable: true })
  data?: string;

  intoDto(): MetricDto {
    return {
      id: this.id,
      dateTime: this.timestamp.toISOString(),
      prometheusQueryName: this.prometheusQueryName.name,
      data: this.data,
    };
  }
}
