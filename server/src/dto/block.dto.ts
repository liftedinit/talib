import { ApiProperty } from "@nestjs/swagger";

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
