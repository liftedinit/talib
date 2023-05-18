import { ApiProperty } from "@nestjs/swagger";

export class MetricDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  query: string;

  @ApiProperty({ required: false })
  description?: string;
}

export class MetricDetailsDto extends MetricDto {
  @ApiProperty({ description: "Timestand of prometheus query" })
  timestamp: string;

  @ApiProperty({ description: "Body of prometheus query" })
  body: string;
}

export class CreateMetricDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  query: string;

  @ApiProperty({ required: false })
  description?: string;
}
