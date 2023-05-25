import { ApiProperty } from "@nestjs/swagger";

export class MetricDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty({ required: false })
  label: string;

  @ApiProperty()
  query: string;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty({ required: false })
  location?: string;
}

export class CreateMetricDto {
  @ApiProperty()
  name: string;

  @ApiProperty({ required: false })
  label: string;

  @ApiProperty()
  query: string;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty({ required: false })
  location?: string;
}
