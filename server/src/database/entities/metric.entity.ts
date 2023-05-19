import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { MetricDto, CreateMetricDto } from "../../dto/metric.dto";

@Entity()
export class Metric {
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

  @Column({ nullable: true })
  homepage: boolean;

  intoDto(): MetricDto {
    return {
      id: this.id,
      name: this.name,
      label: this.label,
      query: this.query,
      description: this.description,
      homepage: this.homepage,
    };
  }

  public static createWithDto(dto: CreateMetricDto): Metric {
    const result = new Metric();
    result.name = dto.name;
    result.label = dto.label;
    result.query = dto.query;
    result.description = dto.description;
    result.homepage = dto.homepage;
    return result;
  }
}
