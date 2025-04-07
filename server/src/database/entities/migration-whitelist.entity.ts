// server/src/database/entities/migration-whitelist.entity.ts
import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";
import { MigrationWhitelistDto } from "../../dto/migration-whitelist.dto";

@Entity()
export class MigrationWhitelist {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  manifestAddress: string;

  intoDto(): MigrationWhitelistDto {
    return {
      manifestAddress: this.manifestAddress,
    };
  }
}