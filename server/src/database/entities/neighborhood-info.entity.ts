import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { NeighborhoodInfoDto } from "../../dto/neighborhood-info.dto";
// import { bufferToHex } from "../../utils/convert";
import { Neighborhood } from "./neighborhood.entity";

@Entity()
export class NeighborhoodInfo {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(
    () => Neighborhood,
    (neighborhood) => neighborhood.neighborhoodInfo,
    {
      onDelete: "CASCADE",
    },
  )
  neighborhood: Neighborhood;

  @Column({ name: "height", type: "integer", nullable: false })
  current: number;

  @Column("simple-array", { nullable: true })
  previous: number[];

  @Column({ nullable: true })
  infoType: string;

  intoDto(): NeighborhoodInfoDto {
    return {
      current: this.current,
      previous: this.previous,
      infoType: this.infoType,
    };
  }
}
