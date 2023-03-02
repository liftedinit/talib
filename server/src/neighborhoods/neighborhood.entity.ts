import { Address } from '@liftedinit/many-js';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import {
  CreateNeighborhoodDto,
  NeighborhoodDetailsDto,
  NeighborhoodDto,
} from './neighborhood.dto';
import { Block } from './blocks/block.entity';
import { bufferToHex } from 'src/utils/convert';
import { NetworkStatusInfo } from '@liftedinit/many-js/dist/network/modules/base/base';

@Entity()
export class Neighborhood {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'address', unique: true })
  protected address_: string;

  @Column({ unique: true })
  url: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column()
  serverName: string;

  @Column({ array: true, type: 'integer' })
  attributes: number[];

  @Column()
  version: string;

  @OneToMany(() => Block, (block) => block.neighborhood, {
    onDelete: 'CASCADE',
  })
  blocks: Block[];

  latestBlock?: Block;

  public get address(): Address {
    return Address.fromString(this.address_);
  }
  public set address(v: Address) {
    // Ensures we also check the format of the string by decoding and re-encoding.
    this.address_ = v.toString();
  }

  public intoDto(): NeighborhoodDto {
    return {
      id: this.id,
      address: this.address_,
      url: this.url,
      name: this.name,
      description: this.description,
    };
  }

  public intoDetailsDto(): NeighborhoodDetailsDto {
    const latestBlock = this.latestBlock;

    return {
      ...this.intoDto(),
      latestBlockHeight: latestBlock ? latestBlock.height : 0,
      latestBlockHash: latestBlock ? bufferToHex(latestBlock.hash) : '',
      latestAppHash: latestBlock ? bufferToHex(latestBlock.appHash) : '',
    };
  }

  public static createWithDto(
    status: NetworkStatusInfo,
    dto: CreateNeighborhoodDto,
  ): Neighborhood {
    const result = new Neighborhood();
    result.name = dto.name;
    result.address = Address.fromString(status.address);
    result.url = new URL(dto.url).toString();
    result.description = dto.description;

    result.serverName = status.serverName;
    result.version = status.serverVersion;
    result.attributes = status.attributes;

    return result;
  }
}
