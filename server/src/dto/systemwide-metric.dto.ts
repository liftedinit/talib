import { ApiProperty } from "@nestjs/swagger";
import { oneLine } from "common-tags";

export class SystemWideMetricDto {
  @ApiProperty()
  id: number;

  @ApiProperty({ description: "Metric's associated database query name" })
  name: string;

  @ApiProperty({
    description: oneLine`
      Datetime this metric was collected with.
    `,
  })
  timestamp: Date;

  @ApiProperty({ description: "Data collected for the metric" })
  data: string;
}

export class SystemWideMetricDetailsDto {
  @ApiProperty()
  timestamp: Date;

  @ApiProperty()
  name: string;

  @ApiProperty()
  data: string | number;
}

export class CreateSystemWideMetricDto {
  @ApiProperty()
  timestamp: Date;

  @ApiProperty()
  name: string;

  @ApiProperty()
  data: string;
}
