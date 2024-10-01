import { Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { TokenDto } from "../../dto/token.dto";
import { Neighborhood } from "./neighborhood.entity";

@Entity()
@Index(['neighborhood', 'address'], { unique: true })
export class Token {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Neighborhood, (neighborhood) => neighborhood.events, {
    onDelete: "CASCADE",
  })
  neighborhood: Neighborhood;

  @Column()
  name: string;

  @Column({ })
  symbol: string;

  @Column({ type: "bytea" })
  address: ArrayBuffer;

  @Column({ nullable: true })
  precision: number;

  @Column({ nullable: true })
  totalSupply: string;

  @Column({ nullable: true })
  circulatingSupply: string;

  intoDto(): TokenDto {
    return {
      id: this.id,
      name: this.name,
      symbol: this.symbol,
      address: this.address.toString(),
      precision: this.precision,
      totalSupply: this.totalSupply,
      circulatingSupply: this.circulatingSupply
    };
  }
}
