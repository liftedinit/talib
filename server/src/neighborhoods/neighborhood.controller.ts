import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Query,
  Put,
  Logger,
} from "@nestjs/common";
import { ApiResponse, ApiQuery } from "@nestjs/swagger";
import {
  CreateNeighborhoodDto,
  NeighborhoodDetailsDto,
  NeighborhoodDto,
} from "../dto/neighborhood.dto";
import { Public } from "../utils/decorators";
import { NeighborhoodService } from "./neighborhood.service";

@Controller("neighborhoods")
export class NeighborhoodController {
  private readonly logger = new Logger(NeighborhoodController.name);

  constructor(private neighborhood: NeighborhoodService) {}

  @Public()
  @Get()
  @ApiQuery({ name: "searchable", required: false })
  @ApiResponse({
    status: 200,
    type: NeighborhoodDto,
    isArray: true,
    description: "List all neighborhoods watched by this instance.",
  })
  async findAll(
    @Query("searchable") searchable?: boolean,
  ): Promise<NeighborhoodDto[]> {
    if (!searchable) {
      searchable = true;
    }

    const neighborhoods = await this.neighborhood.findAll();
    const filteredNeighborhoods = neighborhoods.filter(
      (n) => n.searchable === searchable,
    );

    return filteredNeighborhoods.map((x) => x.intoDto());
  }

  @Get(":nid")
  @ApiResponse({
    status: 200,
    type: NeighborhoodDetailsDto,
    description: "Show info about one neighborhood watched by this instance.",
  })
  async findOne(
    @Param("nid", ParseIntPipe) nid: number,
  ): Promise<NeighborhoodDetailsDto> {
    const n = await this.neighborhood.get(nid);
    if (!n) {
      throw new NotFoundException();
    }

    return n.intoDetailsDto();
  }

  @Put()
  async create(@Body() body: CreateNeighborhoodDto): Promise<NeighborhoodDto> {
    console.log("body", body);
    return (await this.neighborhood.create(body)).intoDto();
  }

  @Delete(":nid")
  async remove(@Param("nid", ParseIntPipe) nid: number): Promise<void> {
    await this.neighborhood.removeById(nid);
  }
}
