import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { TokenDto } from "../../dto/token.dto";
import { bufferToHex } from "../../utils/convert";
import { Neighborhood } from "./neighborhood.entity";

@Entity()
export class Token {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Neighborhood, (neighborhood) => neighborhood.events, {
    onDelete: "CASCADE",
  })
  neighborhood: Neighborhood;

  @Column({ unique: true })
  name: string;

  @Column()
  symbol: string;

  @Column({ unique: true })
  address: string;

  @Column({ nullable: true })
  precision: number;

  intoDto(): TokenDto {
    return {
      id: this.id,
      name: this.name,
      symbol: this.symbol,
      address: this.address,
      precision: this.precision,
    };
  }
}
