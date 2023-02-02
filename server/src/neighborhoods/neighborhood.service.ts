import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
    private usersRepository: Repository<Neighborhood>,
    @InjectRepository(Block)
    private blocksRepository: Repository<Block>,
    private block: BlockService,
    private network: NetworkService,
  ) {}

  findAll(): Promise<Neighborhood[]> {
    return this.usersRepository.find();
  }

  findByAddress(address: Address): Promise<Neighborhood> {
    return this.usersRepository.findOne({
      where: { address: address.toString() },
      relations: {
        blocks: true,
      },
    });
  }

  findById(id: number): Promise<Neighborhood> {
    return this.usersRepository.findOne({
      where: { id },
      relations: {
        blocks: true,
      },
    });
  }

  async create(dto: CreateNeighborhoodDto): Promise<Neighborhood> {
    const url = dto.url;
    const network = await this.network.forUrl(url);
    const status = (await network.base.status()).status;
    if (!status) {
      throw new Error('Server returned an invalid status.');
    }

    const entity = Neighborhood.createWithDto(
      Address.fromString(status.address),
      dto,
    );

    const block = await this.block.createLatestOf(entity);

    await this.usersRepository.save([entity]);
    await this.blocksRepository.save([block]);
    return entity;
  }

  async removeById(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }

  async removeByAddress(address: Address): Promise<void> {
    const entity = await this.usersRepository.findOneBy({
      address: address.toString(),
    });
    await this.removeById(entity.id);
  }
}
