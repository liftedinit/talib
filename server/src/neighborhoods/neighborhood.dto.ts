import { ApiProperty } from "@nestjs/swagger";

export class NeighborhoodDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  address: string;

  @ApiProperty()
  url: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ required: false })
  description?: string;
}

export class NeighborhoodDetailsDto extends NeighborhoodDto {
  @ApiProperty()
  latestBlockHeight: number;

  @ApiProperty()
  latestBlockHash: string;

  @ApiProperty()
  latestAppHash: string;
}

export class CreateNeighborhoodDto {
  @ApiProperty()
  url: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ required: false })
  description?: string;
}
