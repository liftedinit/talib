import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  Index,
} from "typeorm";
import { LocationDto } from "../../dto/location.dto";

@Entity()
@Index(["prometheusQueryId", "timestamp"], { unique: true })
export class Metric {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  instance: string;

  @Column()
  latitude: number;

  @Column()
  longitude: number;

  intoDto(): LocationDto {
    return {
      id: this.id,
      instance: this.instance,
      latitude: this.latitude,
      longitude: this.longitude,
    };
  }
}
