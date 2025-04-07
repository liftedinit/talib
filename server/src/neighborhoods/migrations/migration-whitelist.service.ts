// server/src/neighborhoods/migrations/migration-whitelist.service.ts
import { Injectable, Logger, ConflictException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { MigrationWhitelist } from "../../database/entities/migration-whitelist.entity";
import { MigrationWhitelistDto } from "../../dto/migration-whitelist.dto";

@Injectable()
export class MigrationWhitelistService {
  private readonly logger = new Logger(MigrationWhitelistService.name);

  constructor(
    @InjectRepository(MigrationWhitelist)
    private whitelistRepository: Repository<MigrationWhitelist>,
  ) {}

  async findAll(): Promise<MigrationWhitelistDto[]> {
    const whitelist = await this.whitelistRepository.find();
    return whitelist.map(item => ({
      manifestAddress: item.manifestAddress
    }));
  }

  async addAddress(manifestAddress: string): Promise<MigrationWhitelistDto> {
    // Check if address already exists
    const existing = await this.whitelistRepository.findOne({
      where: { manifestAddress }
    });

    if (existing) {
      throw new ConflictException(`Address ${manifestAddress} is already in the whitelist`);
    }

    // Create new whitelist entry
    const newEntry = this.whitelistRepository.create({ manifestAddress });
    await this.whitelistRepository.save(newEntry);

    return { manifestAddress: newEntry.manifestAddress };
  }
}