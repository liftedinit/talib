import { Body, Controller, Delete, Get, Put } from '@nestjs/common';
import { NeighborhoodService } from './neighborhood.service';
import { Neighborhood } from './neighborhood.entity';
import { CreateNeighborhoodDto } from './neighborhood.dto';

@Controller('api/v1/neighborhoods')
export class NeighborhoodController {
  constructor(private neighborhood: NeighborhoodService) {}

  @Get()
  async findAll(): Promise<Neighborhood[]> {
    return this.neighborhood.findAll();
  }

  @Get(':address')
  async findOne(address: string): Promise<Neighborhood> {
    return this.neighborhood.findByAddress(address);
  }

  @Put()
  async create(@Body() body: CreateNeighborhoodDto): Promise<Neighborhood> {
    return await this.neighborhood.create(Neighborhood.fromCreateDto(body));
  }

  @Delete(':address')
  async remove(address: string): Promise<void> {
    await this.neighborhood.removeByAddress(address);
  }
}
