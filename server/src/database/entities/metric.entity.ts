import {
  Column,
  Entity,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
  Index,
} from "typeorm";
import { MetricDto } from "../../dto/metric.dto";
import { PrometheusQuery } from "./prometheus-query.entity";

@Entity()
@Index(["prometheusQueryId", "timestamp"], { unique: true })
export class Metric {
  @PrimaryGeneratedColumn()
  id: number;

  @Index("idx_metric_query", ["prometheusQueryId"])
  @ManyToOne(() => PrometheusQuery, (prometheusQuery) => prometheusQuery.id, {
    nullable: true,
  })
  @JoinColumn({ name: "prometheus_query_id" })
  prometheusQueryId: PrometheusQuery;

  @Index("idx_metric_timestamp", ["timestamp"])
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
