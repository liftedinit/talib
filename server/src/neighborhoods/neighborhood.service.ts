import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Neighborhood } from './neighborhood.entity';
import { CreateNeighborhoodDto } from './neighborhood.dto';
import { BlockService } from './blocks/block.service';
import { Address, Base, Network } from '@liftedinit/many-js';
import { NetworkService } from '../services/network.service';
import { Block } from './blocks/block.entity';

@Injectable()
export class NeighborhoodService {
  constructor(
    @InjectRepository(Neighborhood)
    private neighborhoodRepository: Repository<Neighborhood>,
    @InjectRepository(Block)
    private blockRepository: Repository<Block>,
    private block: BlockService,
    private network: NetworkService,
  ) {}

  findAll(): Promise<Neighborhood[]> {
    return this.neighborhoodRepository.find();
  }

  private addDetailsToQuery(query: SelectQueryBuilder<Neighborhood>) {
    return query
      .leftJoinAndMapOne(
        'n.latestBlock',
        'n.blocks',
        'block',
        'n.id = block.neighborhoodId',
      )
      .where(
        (_qb) =>
          'block.height = ' +
          query
            .subQuery()
            .select('MAX(height)')
            .from(Block, 'block')
            .where('n.id = block.neighborhoodId')
            .getQuery(),
      );
  }

  find(
    where: { address?: Address | string; id?: number },
    details = false,
  ): Promise<Neighborhood | null> {
    if (where.address !== undefined) {
      (where as any).address_ = where.address.toString();
    }

    let query = this.neighborhoodRepository
      .createQueryBuilder('n')
      .where(where);

    if (details) {
      query = this.addDetailsToQuery(query);
    }

    return query.getOne();
  }

  async create(dto: CreateNeighborhoodDto): Promise<Neighborhood> {
    const url = dto.url;
    const network = await this.network.forUrl(url);
    const status = (await network.base.status()).status;
    if (!status) {
      throw new Error('Server returned an invalid status.');
    }

    const entity = Neighborhood.createWithDto(status, dto);
    await this.neighborhoodRepository.save([entity]);

    await this.block.createLatestOf(entity);
    return entity;
  }

  async removeById(id: number): Promise<void> {
    await this.neighborhoodRepository.delete(id);
  }

  async removeByAddress(address: Address): Promise<void> {
    const entity = await this.neighborhoodRepository.findOneBy({
      address: address.toString(),
    });
    await this.removeById(entity.id);
  }
}
