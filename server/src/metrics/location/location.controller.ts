import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Put,
  Logger,
} from "@nestjs/common";
import {
  LocationDto,
  CreateLocationDto,
} from "../../dto/location.dto";
import { ApiResponse } from "@nestjs/swagger";
import { LocationService } from "./location.service";
import { Location} from "../../database/entities/location.entity";

@Controller("location")
export class LocationController {
  private readonly logger = new Logger(LocationController.name);

  constructor(private location: LocationService) {}

  @Get()
  @ApiResponse({
    status: 200,
    type: LocationDto,
    isArray: true,
    description: "List all locations watched by this instance.",
  })
  async findAll(): Promise<LocationDto[]> {
    return (await this.location.findAll()).map((x) => x.intoDto());
  }

  @Get(":name")
  @ApiResponse({
    status: 200,
    type: LocationDto,
    description: "Show info about one location watched by this instance.",
  })
  async findOne(@Param("name") name: string): Promise<LocationDto> {
    const n = await this.location.get(name);
    if (!n) {
      throw new NotFoundException();
    }

    return n.intoDto();
  }

  @Put()
  async create(
    @Body() body: CreateLocationDto,
  ): Promise<LocationDto> {
    return (await this.location.create(body)).intoDto();
  }

  @Put(":id")
  async updateQuery(
    @Param("id") id: number,
    @Body() updateQueryDto: Partial<LocationDto>,
  ): Promise<Location> {
    const updatedQuery = await this.location.update(id, updateQueryDto);

    if (!updatedQuery) {
      throw new NotFoundException(`Query with ID ${id} not found`);
    }

    return updatedQuery;
  }

  @Delete(":id")
  async remove(@Param("id", ParseIntPipe) id: number): Promise<void> {
    await this.location.removeById(id);
  }
}
