import { Optional } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";

enum InfoType {
  Prometheus = "prometheus",
  SQL = "sql",
  LogQL = "logql",
}

export class NeighborhoodInfoDto {
  @ApiProperty()
  current: number;

  @ApiProperty({
    isArray: true,
    description: `All heights from each network reset.`,
  })
  previous: number[];

  @ApiProperty({
    enum: InfoType,
    description: "The type of the info stored for the neighborhood.",
  })
  infoType: string;
}

export class UpdateCurrentDto {
  @ApiProperty()
  current: number;

  @Optional()
  @ApiProperty()
  previous: number[];

  @Optional()
  @ApiProperty({
    enum: InfoType,
  })
  infoType: string;
}
