import { ApiProperty } from "@nestjs/swagger";
import { NeighborhoodDto } from "./neighborhood.dto";

export class BlockDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  neighborhood: NeighborhoodDto;

  @ApiProperty()
  height: number;

  @ApiProperty()
  txCount: number;
}
