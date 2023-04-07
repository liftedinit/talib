import { ApiProperty } from "@nestjs/swagger";
import { oneLine } from "common-tags";

export class TransactionSimpleDto {
  @ApiProperty({ description: "Transaction Hash" })
  hash: string;
}

export class TransactionDto extends TransactionSimpleDto {
  @ApiProperty({ description: "Block Hash that included this transaction" })
  blockHash: string;

  @ApiProperty({ description: "Block Height that included this transaction" })
  blockHeight: number;

  @ApiProperty({ description: "Index of this transaction in the block" })
  blockIndex: number;

  @ApiProperty({
    description: oneLine`
      Datetime this transaction was executed (not submitted). This is likely
      the block time as all transactions are executed simultaneously. It may
      be different from the submitted time in the transaction details,
      depending on a lot of factors.
    `,
  })
  dateTime: string;

  @ApiProperty()
  method?: string;

  @ApiProperty()
  sender?: string;

  @ApiProperty()
  argument?: any;

  @ApiProperty({ required: false })
  result?: any;

  @ApiProperty({ required: false })
  error?: any;
}

export class TransactionDetailsDto extends TransactionDto {
  @ApiProperty({ description: "Request in binary format" })
  request: string;

  @ApiProperty({ description: "Response in binary format" })
  response: string;
}
