// server/src/neighborhoods/migrations/migration-whitelist.service.ts
import { Injectable, Logger, ConflictException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { MigrationWhitelist as MigrationWhitelistEntity } from "../../database/entities/migration-whitelist.entity";
import { MigrationWhitelistDto } from "../../dto/migration-whitelist.dto";

@Injectable()
export class MigrationWhitelistService {
  private readonly logger = new Logger(MigrationWhitelistService.name);

  constructor(
    @InjectRepository(MigrationWhitelistEntity)
    private whitelistRepository: Repository<MigrationWhitelistEntity>,
  ) {}

  async findAll(): Promise<MigrationWhitelistDto[]> {
    const whitelist = await this.whitelistRepository.find();
    return whitelist.map((item) => (item.intoDto()));
  }

  async addAddress(manyAddress: string): Promise<MigrationWhitelistDto> {
    this.logger.debug(`Adding address to whitelist: ${manyAddress}`);

    // Check if address already exists
    const existing = await this.whitelistRepository.findOne({
      where: { manyAddress }
    });

    if (existing) {
      throw new ConflictException(`Address ${manyAddress} is already in the whitelist`);
    }

    // Create new whitelist entry
    const newEntry = this.whitelistRepository.create({ manyAddress });
    await this.whitelistRepository.save(newEntry);

    return { manyAddress: newEntry.manyAddress };
  }
}