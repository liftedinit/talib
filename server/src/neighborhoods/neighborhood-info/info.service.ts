import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository, SelectQueryBuilder } from "typeorm";
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
    private blockheightRepository: Repository<NeighborhoodInfo>,
    private dataSource: DataSource,
  ) {}
}
