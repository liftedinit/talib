import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, Matches } from "class-validator";

export class MigrationWhitelistDto {
  @ApiProperty({
    description: "The manifest address for the whitelist entry"
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^manifest1[qpzry9x8gf2tvdw0s3jn54khce6mua7l]{1,58}$/i)
  manifestAddress: string;
}