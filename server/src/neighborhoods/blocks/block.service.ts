import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Block } from './block.entity';
import { Neighborhood } from '../neighborhood.entity';
import { NetworkService } from '../../services/network.service';

@Injectable()
export class BlockService {
  constructor(
    @InjectRepository(Block)
    private usersRepository: Repository<Block>,
    private network: NetworkService,
  ) {}

  findOne(id: number): Promise<Block> {
    return this.usersRepository.findOneBy({ id });
  }

  async latestForNeighborhood(
    neighborhood: Neighborhood,
  ): Promise<Block | null> {
    const blocks = await this.usersRepository.find({
      where: { neighborhood: { id: neighborhood.id } },
      take: 1,
      order: { height: 'DESC' },
    });

    return blocks?.[0];
  }

  async createLatestOf(neighborhood: Neighborhood): Promise<Block> {
    const n = await this.network.forUrl(neighborhood.url);
    const info = await n.blockchain.info();

    const b = new Block();
    b.height = info.id.height;
    b.hash = info.id.hash;
    b.appHash = info.appHash;
    b.neighborhood = neighborhood;

    return b;
  }

  // async create(neighborhood: Partial<Neighborhood>): Promise<Neighborhood> {
  //   const entity = await this.usersRepository.create(neighborhood);
  //   await this.usersRepository.save([entity]);
  //   return entity;
  // }
  //
  // async remove(id: string): Promise<void> {
  //   await this.usersRepository.delete(id);
  // }
  //
  // async removeByAddress(address: string): Promise<void> {
  //   const entity = await this.usersRepository.findOneBy({ address });
  //   await this.usersRepository.delete(entity.id);
  // }
}
