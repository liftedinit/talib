import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Metric } from "./metric.entity";
import {
  PrometheusQueryDto,
  CreatePrometheusQueryDto,
} from "../../dto/prometheus-query.dto";

@Entity()
export class PrometheusQuery {
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

  @OneToMany(() => Metric, (metric) => metric.prometheusQueryId)
  metrics: Metric[];

  intoDto(): PrometheusQueryDto {
    return {
      id: this.id,
      name: this.name,
      label: this.label,
      query: this.query,
      description: this.description,
    };
  }

  public static createWithDto(dto: CreatePrometheusQueryDto): PrometheusQuery {
    const result = new PrometheusQuery();
    result.name = dto.name;
    result.label = dto.label;
    result.query = dto.query;
    result.description = dto.description;
    return result;
  }
}
