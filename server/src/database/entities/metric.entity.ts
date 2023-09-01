import {
  Column,
  Entity,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
  Index,
} from "typeorm";
import { MetricDto } from "../../dto/metric.dto";
import { MetricQuery } from "./metric-query.entity";

@Entity()
@Index(["metricQueryId", "timestamp"], { unique: true })
export class Metric {
  @PrimaryGeneratedColumn()
  id: number;

  @Index("idx_metric_query", ["metricQueryId"])
  @ManyToOne(() => MetricQuery, (metricQuery) => metricQuery.id, {
    nullable: true,
  })
  @JoinColumn({ name: "metric_query_id" })
  metricQueryId: MetricQuery;

  @Index("idx_metric_timestamp", ["timestamp"])
  @Column({ type: "timestamptz" })
  timestamp: Date;

  @Column({ nullable: true })
  data?: string;

  intoDto(): MetricDto {
    return {
      id: this.id,
      timestamp: this.timestamp,
      metricQueryId: this.metricQueryId.id,
      data: this.data,
    };
  }
}
