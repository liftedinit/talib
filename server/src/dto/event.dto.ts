import { ApiProperty } from "@nestjs/swagger";
import { oneLine } from "common-tags";

export class EventDto {
  @ApiProperty({ description: "Event ID (as a hexadecimal string)." })
  id: string;

  @ApiProperty({ description: "Event type." })
  eventType: any;

  @ApiProperty({ description: "Method name for the event." })
  method: string;

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
  info: any;
}
