import { Address, NetworkAttributes } from "@liftedinit/many-js";
import { NetworkStatusInfo } from "@liftedinit/many-js/dist/network/modules/base/base";
import { bufferToHex } from "src/utils/convert";
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import {
  CreateNeighborhoodDto,
  NeighborhoodDetailsDto,
  NeighborhoodDto,
} from "../../dto/neighborhood.dto";
import { Block } from "./block.entity";
import { Event } from "./event.entity";
import { NeighborhoodInfo } from "./neighborhood-info.entity";

@Entity()
export class Neighborhood {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
    type: "varchar",
    transformer: {
      from: (value) => Address.fromString(value),
      to: (value) => value.toString(),
    },
  })
  address: Address;

  @Column({ unique: true })
  url: string;

  @Column()
  name: string;

  @Column({ default: true })
  enabled: boolean;

  @Column({ default: true })
  searchable: boolean;

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

  @ManyToOne(() => Event, (event) => event.neighborhood, {
    onDelete: "CASCADE",
  })
  events: Event[];

  @ManyToOne(() => Event, (neighborhoodInfo) => neighborhoodInfo.neighborhood, {
    onDelete: "CASCADE",
  })
  neighborhoodInfo: NeighborhoodInfo[];

  latestBlock?: Block;
  txCount?: number;

  public intoDto(): NeighborhoodDto {
    return {
      id: this.id,
      address: this.address.toString(),
      url: this.url,
      enabled: this.enabled,
      searchable: this.searchable,
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
    result.enabled = dto.enabled;
    result.searchable = dto.searchable;
    result.serverName = status.serverName;
    result.version = status.serverVersion;
    result.attributes = JSON.parse(JSON.stringify(status.attributes));

    return result;
  }

  clean() {
    delete this.latestBlock;
    delete this.txCount;
  }
}
