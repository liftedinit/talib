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
  MetricQueryDto,
  CreateMetricQueryDto,
} from "../../dto/metric-query.dto";
import { ApiResponse } from "@nestjs/swagger";
import { MetricQueryService } from "./query.service";
import { MetricQuery } from "../../database/entities/metric-query.entity";

@Controller("metricquery")
export class MetricQueryController {
  private readonly logger = new Logger(MetricQueryController.name);

  constructor(private metric: MetricQueryService) {}

  @Get()
  @ApiResponse({
    status: 200,
    type: MetricQueryDto,
    isArray: true,
    description: "List all metrics watched by this instance.",
  })
  async findAll(): Promise<MetricQueryDto[]> {
    return (await this.metric.findAll()).map((x) => x.intoDto());
  }

  @Get(":name")
  @ApiResponse({
    status: 200,
    type: MetricQueryDto,
    description: "Show info about one metric watched by this instance.",
  })
  async findOne(@Param("name") name: string): Promise<MetricQueryDto> {
    const n = await this.metric.get(name);
    if (!n) {
      throw new NotFoundException();
    }

    return n.intoDto();
  }

  @Put()
  async create(@Body() body: CreateMetricQueryDto): Promise<MetricQueryDto> {
    return (await this.metric.create(body)).intoDto();
  }

  @Put(":id")
  async updateUser(
    @Param("id") id: number,
    @Body() updateQueryDto: Partial<MetricQueryDto>,
  ): Promise<MetricQuery> {
    const updatedQuery = await this.metric.update(id, updateQueryDto);

    if (!updatedQuery) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return updatedQuery;
  }

  @Delete(":id")
  async remove(@Param("id", ParseIntPipe) id: number): Promise<void> {
    await this.metric.removeById(id);
  }
}
