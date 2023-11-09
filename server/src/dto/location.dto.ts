import { ApiProperty } from "@nestjs/swagger";

export class LocationDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  instance: string;

  @ApiProperty()
  latitude: number;

  @ApiProperty()
  longitude: number;
}

export class LocationDetailsDto {
  @ApiProperty()
  instance: string;

  @ApiProperty()
  latitude: number;

  @ApiProperty()
  longitude: number;
}

export class CreateLocationDto {
  @ApiProperty()
  instance: string;

  @ApiProperty()
  latitude: number;

  @ApiProperty()
  longitude: number;
}
