import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Neighborhood } from './neighborhood.entity';

@Injectable()
export class NeighborhoodService {
  constructor(
    @InjectRepository(Neighborhood)
    private usersRepository: Repository<Neighborhood>,
  ) {}

  findAll(): Promise<Neighborhood[]> {
    return this.usersRepository.find();
  }

  findOne(id: number): Promise<Neighborhood> {
    return this.usersRepository.findOneBy({ id });
  }

  findByAddress(address: string): Promise<Neighborhood> {
    return this.usersRepository.findOneBy({ address });
  }

  async create(neighborhood: Partial<Neighborhood>): Promise<Neighborhood> {
    const entity = await this.usersRepository.create(neighborhood);
    await this.usersRepository.save([entity]);
    return entity;
  }

  async remove(id: string): Promise<void> {
    await this.usersRepository.delete(id);
  }

  async removeByAddress(address: string): Promise<void> {
    const entity = await this.usersRepository.findOneBy({ address });
    await this.usersRepository.delete(entity.id);
  }
}
