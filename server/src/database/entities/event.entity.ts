import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { EventDto } from "../../dto/event.dto";
import { bufferToHex } from "../../utils/convert";
import { Neighborhood } from "./neighborhood.entity";

@Entity()
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Neighborhood, (neighborhood) => neighborhood.events, {
    onDelete: "CASCADE",
  })
  neighborhood: Neighborhood;

  @Column({ type: "bytea" })
  eventId: ArrayBuffer;

  @Column()
  timestamp: Date;

  @Column({ nullable: true })
  method?: string;

  @Column({ nullable: true, type: "simple-json" })
  type?: any;

  @Column({
    type: "simple-json",
  })
  info: any;

  @Column({ type: "text", array: true, default: [] })
  addresses: string[];

  @Column({ nullable: true })
  parseError?: string;

  intoDto(): EventDto {
    return {
      id: bufferToHex(this.eventId),
      dateTime: this.timestamp.toISOString(),
      eventType: this.type,
      method: this.method,
      info: this.info,
    };
  }
}
