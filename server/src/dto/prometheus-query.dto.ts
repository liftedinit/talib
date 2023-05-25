import { ApiProperty } from "@nestjs/swagger";

export class PrometheusQueryDto {
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

export class CreatePrometheusQueryDto {
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
