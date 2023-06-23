import { ApiProperty } from "@nestjs/swagger";
import { oneLine } from "common-tags";

export class MetricDto {
  @ApiProperty()
  id: number;

  @ApiProperty({ description: "Metric's associated prometheus query" })
  prometheusQueryName: string;

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
  prometheusQueryName: string;

  @ApiProperty()
  data: string;
}

export class CreateMetricDto {
  @ApiProperty()
  datetime: string;

  @ApiProperty()
  prometheusQueryName: string;

  @ApiProperty()
  data: string;
}
