import { ApiProperty } from "@nestjs/swagger";
import { TransactionDto } from "./transaction.dto";

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
    type: TransactionDto,
    isArray: true,
    description: `Transactions included in this block.`,
  })
  transactions: TransactionDto[];
}
