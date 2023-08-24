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
  info_type: string;
}

// export class BlockDetailsDto extends BlockDto {
//   @ApiProperty({
//     type: TransactionDto,
//     isArray: true,
//     description: `Transactions included in this block.`,
//   })
//   transactions: TransactionDto[];
// }
