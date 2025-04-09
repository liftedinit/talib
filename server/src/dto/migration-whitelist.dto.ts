import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty } from "class-validator";

export class MigrationWhitelistDto {
  @ApiProperty({
    description: "The many address for the whitelist entry"
  })
  @IsString()
  @IsNotEmpty()
  manyAddress: string;
}