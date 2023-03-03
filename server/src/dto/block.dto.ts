import { ApiProperty } from "@nestjs/swagger";

export class BlockDto {
  @ApiProperty()
  height: number;

  @ApiProperty()
  blockHash: string;

  @ApiProperty()
  appHash: string;

  @ApiProperty()
  txCount?: number;
}
