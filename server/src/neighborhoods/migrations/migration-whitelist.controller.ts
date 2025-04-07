import { Controller, Get, Post, Body, Logger } from "@nestjs/common";
import { ApiOkResponse, ApiOperation, ApiCreatedResponse } from "@nestjs/swagger";
import { MigrationWhitelistDto } from "../../dto/migration-whitelist.dto";
import { MigrationWhitelistService } from "./migration-whitelist.service";

@Controller("migrations-whitelist")
export class MigrationWhitelistController {
  private readonly logger = new Logger(MigrationWhitelistController.name);

  constructor(private whitelistService: MigrationWhitelistService) {}

  @Get()
  @ApiOperation({
    description: "Get the complete migrations whitelist"
  })
  @ApiOkResponse({
    type: MigrationWhitelistDto,
    isArray: true,
    description: "The complete list of whitelisted manifest addresses"
  })
  async getWhitelist(): Promise<MigrationWhitelistDto[]> {
    return this.whitelistService.findAll();
  }

  @Post()
  @ApiOperation({
    description: "Add a new address to the migration whitelist"
  })
  @ApiCreatedResponse({
    type: MigrationWhitelistDto,
    description: "The address was successfully added to the whitelist"
  })
  async addToWhitelist(@Body() dto: MigrationWhitelistDto): Promise<MigrationWhitelistDto> {
    console.log(`Adding address to whitelist: ${JSON.stringify(dto)}`);
    const bech32Pattern = /^manifest1[qpzry9x8gf2tvdw0s3jn54khce6mua7l]{1,58}$/i;

    if (!bech32Pattern.test(dto.manifestAddress)) {
      this.logger.debug(`Invalid bech32 address format: ${dto.manifestAddress}`);
      throw new Error("Invalid bech32 address format");
    }

    return this.whitelistService.addAddress(dto.manifestAddress);
  }
}