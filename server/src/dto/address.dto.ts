import { ApiProperty } from "@nestjs/swagger";
import { EventDto } from "./event.dto";
import { TransactionDto } from "./transaction.dto";

export class AddressDto {
  @ApiProperty({ description: "The address being requested." })
  address: string;

  @ApiProperty({ description: "Transactions that included this transaction" })
  transactions: TransactionDto[];

  @ApiProperty({ description: "Events that included this transaction" })
  events: EventDto[];
}
