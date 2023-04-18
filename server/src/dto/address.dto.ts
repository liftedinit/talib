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

export class BalanceChangeDto {
  @ApiProperty({ description: "Timestamp of the change of balance." })
  timestamp: string;

  @ApiProperty({
    description:
      "Change of balance. This will be a string if the amount cannot fit in 32 bits.",
  })
  amount: number | string;

  eventId: string;
}

export class AddressBalanceDto {
  @ApiProperty({ description: "The address being requested." })
  address: string;

  @ApiProperty({ description: "The balance of the address." })
  changes: {
    symbol: string;
    history: BalanceChangeDto[];
  };
}
