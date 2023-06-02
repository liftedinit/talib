import { Optional } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

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
}

export class CreatePrometheusQueryDto {
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @Optional()
  @ApiProperty({ required: false })
  label: string;

  @IsNotEmpty()
  @ApiProperty()
  query: string;

  @Optional()
  @ApiProperty({ required: false })
  description?: string;
}
