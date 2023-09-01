import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
} from "typeorm";
import { Metric } from "./metric.entity";
import {
  MetricQueryDto,
  CreateMetricQueryDto,
} from "../../dto/metric-query.dto";

const default_created_date = process.env.METRICS_DEFAULT_CREATED_DATE;

@Entity()
export class MetricQuery {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  label: string;

  @Column()
  query: string;

  @Column({ nullable: true })
  description: string;

  @OneToMany(() => Metric, (metric) => metric.metricQueryId)
  metrics: Metric[];

  @CreateDateColumn({
    nullable: true,
    default: default_created_date,
  })
  createdDate: Date;

  @Column({ default: true })
  enabled: boolean;

  @Column({ nullable: true })
  querytype: string;

  intoDto(): MetricQueryDto {
    return {
      id: this.id,
      name: this.name,
      label: this.label,
      enabled: this.enabled,
      query: this.query,
      description: this.description,
      createdDate: this.createdDate.toDateString(),
      querytype: this.querytype,
    };
  }

  public static createWithDto(dto: CreateMetricQueryDto): MetricQuery {
    const result = new MetricQuery();
    result.name = dto.name;
    result.label = dto.label;
    result.enabled = dto.enabled;
    result.query = dto.query;
    result.description = dto.description;
    result.createdDate = dto.createdDate
      ? new Date(dto.createdDate)
      : new Date(default_created_date);
    result.querytype = dto.querytype;
    return result;
  }
}
