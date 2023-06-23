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
  dateTime: string;

  @ApiProperty({ description: "Data collected for the metric" })
  data: string;
}

export class MetricDetailsDto {
  @ApiProperty()
  datetime: string;

  @ApiProperty()
  prometheusQueryId: number;

  @ApiProperty()
  data: string;
}

export class CreateMetricDto {
  @ApiProperty()
  datetime: string;

  @ApiProperty()
  prometheusQueryId: number;

  @ApiProperty()
  data: string;
}
