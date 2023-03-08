import { ApiProperty } from "@nestjs/swagger";
import { TransactionSimpleDto } from "./transaction.dto";

export class BlockDto {
  @ApiProperty()
  height: number;

  @ApiProperty()
  dateTime: string;

  @ApiProperty()
  blockHash: string;

  @ApiProperty()
  appHash: string;

  @ApiProperty()
  txCount?: number;
}

export class BlockDetailsDto extends BlockDto {
  @ApiProperty({
    type: TransactionSimpleDto,
    isArray: true,
    description: `Transactions included in this block.`,
  })
  transactions: TransactionSimpleDto[];
}
