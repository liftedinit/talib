import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository, SelectQueryBuilder } from "typeorm";
import { Neighborhood } from "../../database/entities/neighborhood.entity";
import { NeighborhoodInfo } from "../../database/entities/neighborhood-info.entity";
import { NeighborhoodInfoDto } from "../../dto/neighborhood-info.dto";

interface FindOneOptions {
  details?: boolean;
}

@Injectable()
export class NeighborhoodInfoService {
  private readonly logger = new Logger(NeighborhoodInfoService.name);

  constructor(
    @InjectRepository(NeighborhoodInfo)
    private infoRepository: Repository<NeighborhoodInfo>,
    private dataSource: DataSource,
  ) {}

  async updateBlockHeight(neighborhoodId: Neighborhood, blockHeight: number) {
    const neighborhoodInfo = new NeighborhoodInfo();
    neighborhoodInfo.current = blockHeight;
    neighborhoodInfo.neighborhood = neighborhoodId;

    return this.infoRepository.save(neighborhoodInfo);
  }
}
