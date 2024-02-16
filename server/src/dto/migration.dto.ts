import { ApiProperty } from "@nestjs/swagger";
import { oneLine } from "common-tags";
import { TransactionDetails } from "../database/entities/transaction-details.entity";

export interface Argument {
  from: string;
  to: string;
  amount: number;
  symbol: string;
  memo: string[];
}

export class UpdateMigrationDto {
  @ApiProperty({
    description: oneLine`
      Datetime this migration was executed (not submitted).
    `,
  })
  migrationDatetime: Date;

  @ApiProperty({ description: "Status of the migration" })
  status: string;
}

export class MigrationDto {

  @ApiProperty({ description: "Transaction Hash" })
  hash: string;

  @ApiProperty({ description: "Migration status" })
  status: string;

  @ApiProperty({
    description: oneLine`
      Datetime this migration was executed (not submitted).
    `,
  })
  migrationDatetime: Date;

  @ApiProperty()
  uuid: string;

}

export class MigrationDetailsDto {
  @ApiProperty({ description: "Transaction Hash" })
  hash: string;

  @ApiProperty({ description: "Migration status" })
  status: string;

  @ApiProperty({
    description: oneLine`
      Datetime this migration was executed (not submitted).
    `,
  })
  migrationDatetime: Date;

  @ApiProperty()
  uuid: string;

  @ApiProperty() 
  details: TransactionDetails;

}