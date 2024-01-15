import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  Index,
} from "typeorm";
import { SystemWideMetricDto } from "../../dto/systemwide-metric.dto";

@Entity()
export class SystemWideMetric {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true})
  name: string;

  @Column({ type: "timestamptz" })
  timestamp: Date;

  @Column({ nullable: true })
  data?: string;

  intoDto(): SystemWideMetricDto {
    return {
      id: this.id,
      timestamp: this.timestamp,
      name: this.name,
      data: this.data,
    };
  }
}
