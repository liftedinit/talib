import { Address } from '@liftedinit/many-js';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { CreateNeighborhoodDto } from './neighborhood.dto';

@Entity()
export class Neighborhood {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'address', unique: true })
  protected address_: string;

  @Column()
  url: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  public get address(): Address {
    return Address.fromString(this.address_);
  }
  public set address(v: Address) {
    // Ensures we also check the format of the string by decoding and re-encoding.
    this.address_ = v.toString();
  }

  public static fromCreateDto(
    dto: CreateNeighborhoodDto,
  ): Partial<Neighborhood> {
    return {
      name: dto.name,
      address: Address.fromString(dto.address),
      url: new URL(dto.url).toString(),
      description: dto.description,
    };
  }
}
