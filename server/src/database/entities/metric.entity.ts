import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { MetricDto, CreateMetricDto } from "../../dto/metric.dto";

@Entity()
export class Metric {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column()
  query: string;

  @Column({ nullable: true })
  description: string;

  intoDto(): MetricDto {
    return {
      id: this.id,
      name: this.name,
      query: this.query,
      description: this.description,
    };
  }

  public static createWithDto(dto: CreateMetricDto): Metric {
    const result = new Metric();
    result.name = dto.name;
    result.query = dto.query;
    result.description = dto.description;

    return result;
  }
}