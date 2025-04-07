import { ApiProperty } from "@nestjs/swagger";

export class MigrationWhitelistDto {
  @ApiProperty({
    description: "The manifest address for the whitelist entry"
  })
  manifestAddress: string;
}