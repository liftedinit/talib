import { ApiProperty } from "@nestjs/swagger";
import { TransactionDto } from "./transaction.dto";

export class AddressDto {
  @ApiProperty({ description: "Block Hash that included this transaction" })
  address: string;

  @ApiProperty({ description: "Block Hash that included this transaction" })
  transactions: TransactionDto[];
}
