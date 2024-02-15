import { ApiProperty } from "@nestjs/swagger";
import { oneLine } from "common-tags";
import { TransactionDetailsDto } from "./transaction.dto";

export class MigrationDto {

  @ApiProperty({ description: "Transaction Hash" })
  hash: string;
}

export class UpdateMigrationDto {
  @ApiProperty({
    description: oneLine`
      Datetime this migration was executed (not submitted).
    `,
  })
  migrationDatetime: Date;

  @ApiProperty({ description: "Status of the migration" })
  status: boolean;
}

export class MigrationDetailsDto {
  @ApiProperty({
    type: TransactionDetailsDto,
    isArray: true,
    description: `Transaction details for migration.`,
  })
  transaction: TransactionDetailsDto;

  @ApiProperty({ description: "Migration status" })
  status: boolean;

  @ApiProperty({
    description: oneLine`
      Datetime this migration was executed (not submitted).
    `,
  })
  migrationDatetime: Date;
}