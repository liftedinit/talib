import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Block } from '../../database/entities/block.entity';
import { Neighborhood } from '../../database/entities/neighborhood.entity';
import { NetworkService } from '../../services/network.service';
import { Block as ManyBlock } from '../../utils/blockchain';

@Injectable()
export class BlockService {
  constructor(
    @InjectRepository(Block)
    private blockRepository: Repository<Block>,
    private network: NetworkService,
    private dataSource: DataSource,
  ) {}

  findOne(id: number): Promise<Block> {
    return this.blockRepository.findOneBy({ id });
  }

  findOneByHeight(
    neighborhood: Neighborhood,
    height: number,
  ): Promise<Block | null> {
    return this.blockRepository.findOneBy({
      neighborhood: { id: neighborhood.id },
      height: height,
    });
  }

  async latestForNeighborhood(
    neighborhood: Neighborhood,
  ): Promise<Block | null> {
    const blocks = await this.blockRepository.find({
      where: { neighborhood: { id: neighborhood.id } },
      take: 1,
      order: { height: 'DESC' },
    });

    return blocks?.[0];
  }

  async createLatestOf(neighborhood: Neighborhood): Promise<Block> {
    const n = await this.network.forUrl(neighborhood.url);
    const info = await n.blockchain.info();
    const latest: ManyBlock = await n.blockchain.blockByHeight(
      info.latestBlock.height,
    );
    const maybeLastBlock = await this.findOneByHeight(
      neighborhood,
      latest.identifier.height,
    );
    return (
      maybeLastBlock ?? (await this.createFromManyBlock(neighborhood, latest))
    );
  }

  async missingBlockHeightsForNeighborhood(
    neighborhood: Neighborhood,
    max?: number,
  ): Promise<number[]> {
    let query = `
      WITH Missing (missnum, maxid) AS (
        SELECT 1 AS missnum, (select max(height) from block)
        UNION ALL
        SELECT missnum + 1, maxid FROM Missing
        WHERE missnum < maxid
      )
      SELECT missnum
      FROM Missing
      LEFT OUTER JOIN block tt on tt.height = Missing.missnum
      WHERE tt.height is NULL
      ${max !== undefined ? 'LIMIT ' + max : ''}
    ;`;

    const result = await this.dataSource.query(query);
    return result.map((r) => Number(r.missnum)) as number[];
  }

  async createFromManyBlock(neighborhood: Neighborhood, block: ManyBlock) {
    const entity = new Block();
    entity.appHash = block.appHash;
    entity.height = block.identifier.height;
    entity.hash = block.identifier.hash;
    entity.neighborhood = neighborhood;
    entity.transactions = [];

    return await this.blockRepository.save(entity);
  }
}
