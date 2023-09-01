import { ApiProperty } from "@nestjs/swagger";
import { oneLine } from "common-tags";

export class MetricDto {
  @ApiProperty()
  id: number;

  @ApiProperty({ description: "Metric's associated query ID" })
  metricQueryId: number;

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
  metricQueryId: number;

  @ApiProperty()
  data: string | number;
}

export class CreateMetricDto {
  @ApiProperty()
  timestamp: Date;

  @ApiProperty()
  metricQueryId: number;

  @ApiProperty()
  data: string;
}
