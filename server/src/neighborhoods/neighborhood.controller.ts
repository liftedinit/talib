import { Body, Controller, Delete, Get, Param, Put } from '@nestjs/common';
import { NeighborhoodService } from './neighborhood.service';
import {
  CreateNeighborhoodDto,
  NeighborhoodDetailsDto,
  NeighborhoodDto,
} from './neighborhood.dto';
import { ApiResponse } from '@nestjs/swagger';
import { BlockService } from './blocks/block.service';
import { Address } from '@liftedinit/many-js';
import { Neighborhood } from './neighborhood.entity';

@Controller('api/v1/neighborhoods')
export class NeighborhoodController {
  constructor(
    private neighborhood: NeighborhoodService,
    private block: BlockService,
  ) {}

  private async findByAddressQueryParam(
    address: string,
    details = false,
  ): Promise<Neighborhood> {
    let a: Address;
    let i: number;
    try {
      a = Address.fromString(address);
    } catch (_) {
      i = Number.parseInt(address);
    }

    if (a) {
      return await this.neighborhood.find({ address: a }, details);
    } else if (i !== undefined) {
      return await this.neighborhood.find({ id: i }, details);
    } else {
      throw new Error(
        `Parameter (${JSON.stringify(address)}) is neither address nor id.`,
      );
    }
  }

  @Get()
  @ApiResponse({
    status: 200,
    type: NeighborhoodDto,
    isArray: true,
    description: 'List all neighborhoods watched by this instance.',
  })
  async findAll(): Promise<NeighborhoodDto[]> {
    return (await this.neighborhood.findAll()).map((x) => x.intoDto());
  }

  @Get(':address')
  @ApiResponse({
    status: 200,
    type: NeighborhoodDetailsDto,
    description: 'Show info about one neighborhood watched by this instance.',
  })
  async findOne(
    @Param('address') address: string,
  ): Promise<NeighborhoodDetailsDto> {
    const n = await this.findByAddressQueryParam(address, true);
    return n.intoDetailsDto();
  }

  @Put()
  async create(@Body() body: CreateNeighborhoodDto): Promise<NeighborhoodDto> {
    return (await this.neighborhood.create(body)).intoDto();
  }

  @Delete(':address')
  async remove(@Param('address') address: string): Promise<void> {
    const n = await this.findByAddressQueryParam(address);
    await this.neighborhood.removeById(n.id);
  }
}
