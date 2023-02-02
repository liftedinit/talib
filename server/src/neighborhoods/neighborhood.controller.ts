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
  ): Promise<Neighborhood> {
    let a: Address | undefined;
    let i: number | undefined;
    try {
      a = Address.fromString(address);
    } catch (_) {
      i = Number.parseInt(address);
    }

    if (a) {
      return await this.neighborhood.findByAddress(a);
    } else if (i) {
      return await this.neighborhood.findById(i);
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
    type: NeighborhoodDto,
    description: 'Show info about one neighborhood watched by this instance.',
  })
  async findOne(@Param() params): Promise<NeighborhoodDetailsDto> {
    const n = await this.findByAddressQueryParam(params.address);
    return n.intoDetailsDto();
  }

  @Put()
  async create(@Body() body: CreateNeighborhoodDto): Promise<NeighborhoodDto> {
    return (await this.neighborhood.create(body)).intoDto();
  }

  @Delete(':address')
  async remove(@Param() params): Promise<void> {
    const n = await this.findByAddressQueryParam(params.address);
    await this.neighborhood.removeById(n.id);
  }
}
