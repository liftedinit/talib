import { ApiProperty  } from "@nestjs/swagger";
import { IPaginationMeta } from "nestjs-typeorm-paginate";

export class PaginationMetaDto implements IPaginationMeta {
  @ApiProperty()
  totalItems: number;

  @ApiProperty()
  itemCount: number;

  @ApiProperty() 
  itemsPerPage: number;

  @ApiProperty()
  totalPages: number;

  @ApiProperty()
  currentPage: number;
}
