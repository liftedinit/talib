// server/src/database/entities/migration-whitelist.entity.ts
import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class MigrationWhitelist {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  manifestAddress: string;
}