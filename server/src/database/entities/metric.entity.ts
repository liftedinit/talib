import {
  Column,
  Entity,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
} from "typeorm";
import { MetricDto, CreateMetricDto } from "../../dto/metric.dto";
import { PrometheusQuery } from "./prometheus-query.entity";

@Entity()
export class Metric {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => PrometheusQuery, (prometheusQuery) => prometheusQuery.id, {
    nullable: true,
  })
  @JoinColumn({ name: "prometheus_query_id" })
  prometheusQueryId: PrometheusQuery;

  @Column({ type: "timestamptz" })
  timestamp: Date;

  @Column({ nullable: true })
  data?: string;

  intoDto(): MetricDto {
    return {
      id: this.id,
      timestamp: this.timestamp,
      prometheusQueryId: this.prometheusQueryId.id,
      data: this.data,
    };
  }
}
