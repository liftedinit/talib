import { Address } from '@liftedinit/many-js';
import { ApiProperty } from '@nestjs/swagger';
import { Neighborhood } from './neighborhood.entity';

export class CreateNeighborhoodDto {
  @ApiProperty()
  address: string;

  @ApiProperty()
  url: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ required: false })
  description?: string;
}
