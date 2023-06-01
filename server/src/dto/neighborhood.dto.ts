import { Optional } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsUrl } from "class-validator";

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

  @ApiProperty({
    description:
      "The total transactions in the database for this neighborhood. In some cases this might not be filled.",
  })
  totalTransactionCount?: number;
}

export class CreateNeighborhoodDto {
  @IsUrl()
  @ApiProperty()
  url: string;

  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @Optional()
  @ApiProperty({ required: false })
  description?: string;
}
