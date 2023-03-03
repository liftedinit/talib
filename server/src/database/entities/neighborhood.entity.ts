import { Address, NetworkAttributes } from "@liftedinit/many-js";
import { NetworkStatusInfo } from "@liftedinit/many-js/dist/network/modules/base/base";
import { bufferToHex } from "src/utils/convert";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import {
  CreateNeighborhoodDto,
  NeighborhoodDetailsDto,
  NeighborhoodDto,
} from "../../dto/neighborhood.dto";
import { Block } from "./block.entity";

@Entity()
export class Neighborhood {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "address", unique: true })
  protected address_: string;

  @Column({ unique: true })
  url: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column()
  serverName: string;

  @Column({ type: "simple-json" })
  attributes: NetworkAttributes;

  @Column()
  version: string;

  @OneToMany(() => Block, (block) => block.neighborhood, {
    onDelete: "CASCADE",
  })
  blocks: Block[];

  latestBlock?: Block;
  txCount?: number;

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
      latestBlockHash: latestBlock ? bufferToHex(latestBlock.hash) : "",
      latestAppHash: latestBlock ? bufferToHex(latestBlock.appHash) : "",
      totalTransactionCount: this.txCount,
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
    result.attributes = JSON.parse(JSON.stringify(status.attributes));

    return result;
  }
}
