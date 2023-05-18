import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Put,
} from "@nestjs/common";
import { MetricDto, CreateMetricDto } from "src/dto/metric.dto";
import { ApiResponse } from "@nestjs/swagger";
import { MetricService } from "./metric.service";

@Controller("metrics")
export class MetricController {
  constructor(private metric: MetricService) {}

  @Get()
  @ApiResponse({
    status: 200,
    type: MetricDto,
    isArray: true,
    description: "List all metrics watched by this instance.",
  })
  async findAll(): Promise<MetricDto[]> {
    return (await this.metric.findAll()).map((x) => x.intoDto());
  }

  @Get(":nid")
  @ApiResponse({
    status: 200,
    type: MetricDto,
    description: "Show info about one metric watched by this instance.",
  })
  async findOne(@Param("nid", ParseIntPipe) nid: number): Promise<MetricDto> {
    const n = await this.metric.get(nid);
    if (!n) {
      throw new NotFoundException();
    }

    return n.intoDto();
  }

  @Put()
  async create(@Body() body: CreateMetricDto): Promise<MetricDto> {
    return (await this.metric.create(body)).intoDto();
  }

  @Delete(":nid")
  async remove(@Param("nid", ParseIntPipe) nid: number): Promise<void> {
    await this.metric.removeById(nid);
  }
}
