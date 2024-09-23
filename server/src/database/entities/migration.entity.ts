import {
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from "typeorm";
import { Transaction } from "./transaction.entity";
import { TransactionDetails } from "./transaction-details.entity"

import { MigrationDto, CreateMigrationDto, UpdateMigrationDto } from "../../dto/migration.dto";
import { bufferToHex } from "../../utils/convert";

@Entity()
export class Migration {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', default: null })
  status: number;

  @CreateDateColumn({
    nullable: false
  })
  createdDate: Date;

  @OneToOne(() => Transaction, {
    onDelete: "CASCADE",
  })
  @JoinColumn()
  transaction: Transaction;

  @OneToOne(() => TransactionDetails, {
    onDelete: "CASCADE",
  })
  @JoinColumn()
  details: TransactionDetails;

  @Column({ type: "bytea" })
  manyHash: ArrayBuffer;

  @Column() 
  uuid: string;

  @Column()
  manifestAddress: string;

  @Column({ nullable: true, default: null })
  manifestDatetime: Date;

  @Column({ nullable: true, default: null })
  manifestHash: string;

  @Column({ nullable: true, length: 8192 })
  error?: string;

  intoDto(): MigrationDto {
    return {
      status: this.status,
      createdDate: this.createdDate.toISOString(),
      uuid: this.uuid,
      manyHash: bufferToHex(this.manyHash),
      manifestAddress: this.manifestAddress,
      manifestDatetime: this.manifestDatetime,
      manifestHash: this.manifestHash,
      error: this.error,
    };
  }

  createDto(): CreateMigrationDto {
    const dto = new CreateMigrationDto();
    dto.status = this.status;
    dto.createdDate = this.createdDate.toISOString();
    dto.uuid = this.uuid;
    dto.manyHash = bufferToHex(this.manyHash);
    dto.manifestAddress = this.manifestAddress;
    return dto;
  }

  updateDto(): UpdateMigrationDto {
    return {
      status: this.status, 
      manifestDatetime: this.manifestDatetime,
      manifestHash: this.manifestHash,
      error: this.error,
    }
  }

}