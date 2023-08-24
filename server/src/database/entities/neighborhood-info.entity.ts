import {
  Column,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { NeighborhoodInfoDto } from "../../dto/neighborhood-info.dto";
// import { bufferToHex } from "../../utils/convert";
import { Neighborhood } from "./neighborhood.entity";

@Entity()
export class NeighborhoodInfo {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Neighborhood, (neighborhood) => neighborhood.blocks, {
    onDelete: "CASCADE",
  })
  neighborhood: Neighborhood;

  @Column({ name: "height", type: "integer", nullable: false })
  current: number;

  @Column("simple-array", { nullable: true })
  previous: number[];

  @Column({ nullable: true })
  info_type: string;

  intoDto(): NeighborhoodInfoDto {
    return {
      current: this.current,
      previous: this.previous,
      info_type: this.info_type,
    };
  }

  // intoDetailsDto(): BlockDetailsDto {
  //   return {
  //     ...this.intoDto(),
  //     transactions: this.transactions?.map((t) => t.intoDto(this)),
  //   };
  // }
}
