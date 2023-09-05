import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository, SelectQueryBuilder } from "typeorm";
import { Neighborhood } from "../../database/entities/neighborhood.entity";
import { NeighborhoodInfo } from "../../database/entities/neighborhood-info.entity";
import {
  NeighborhoodInfoDto,
  UpdateCurrentDto,
} from "../../dto/neighborhood-info.dto";

@Injectable()
export class NeighborhoodInfoService {
  private readonly logger = new Logger(NeighborhoodInfoService.name);

  constructor(
    @InjectRepository(NeighborhoodInfo)
    private infoRepository: Repository<NeighborhoodInfo>,
    private dataSource: DataSource,
  ) {}

  async get(neighborhoodId: Neighborhood, infoType: string) {
    const query = await this.infoRepository
      .createQueryBuilder("n")
      .where({ neighborhood: neighborhoodId })
      .andWhere("n.infoType = :infoType", {
        infoType: infoType,
      })
      .limit(1);

    this.logger.debug(
      `get(${neighborhoodId}, ${infoType}): \`${query.getOne()}\``,
    );

    return query.getOne();
  }

  async createCurrent(
    neighborhoodId: Neighborhood,
    infoType: string,
    value: any,
  ) {
    const neighborhoodInfo = new NeighborhoodInfo();
    neighborhoodInfo.current = value;
    neighborhoodInfo.infoType = infoType;
    neighborhoodInfo.neighborhood = neighborhoodId;

    return this.infoRepository.save(neighborhoodInfo);
  }

  async updateCurrent(neighborhoodId: number, infoType: string, value: any) {
    const neighborhoodInfo = await this.infoRepository
      .createQueryBuilder("n")
      .update()
      .set({ current: value })
      .where({ neighborhood: neighborhoodId })
      .where("n.infoType = :infoType", {
        infoType: infoType,
      })
      .limit(1);

    this.logger.debug(
      `updateCurrent(${neighborhoodId}, ${infoType}): \`${neighborhoodInfo}\``,
    );

    return neighborhoodInfo;
  }
}
