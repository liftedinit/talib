import { ApiProperty } from "@nestjs/swagger";
import { oneLine } from "common-tags";

export class MetricDto {
  @ApiProperty()
  id: number;

  @ApiProperty({ description: "Metric's associated prometheus query" })
  prometheusQueryId: number;

  @ApiProperty({
    description: oneLine`
      Datetime this metric was collected with.
    `,
  })
  timestamp: Date;

  @ApiProperty({ description: "Data collected for the metric" })
  data: string;
}

export class MetricDetailsDto {
  @ApiProperty()
  timestamp: Date;

  @ApiProperty()
  prometheusQueryId: number;

  @ApiProperty()
  data: string;
}

export class CreateMetricDto {
  @ApiProperty()
  timestamp: Date;

  @ApiProperty()
  prometheusQueryId: number;

  @ApiProperty()
  data: string;
}
