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
  PrometheusQueryDto,
  CreatePrometheusQueryDto,
} from "../../dto/prometheus-query.dto";
import { ApiResponse } from "@nestjs/swagger";
import { PrometheusQueryService } from "./query.service";

@Controller("prometheusquery")
export class PrometheusQueryController {
  private readonly logger = new Logger(PrometheusQueryController.name);

  constructor(private metric: PrometheusQueryService) {}

  @Get()
  @ApiResponse({
    status: 200,
    type: PrometheusQueryDto,
    isArray: true,
    description: "List all metrics watched by this instance.",
  })
  async findAll(): Promise<PrometheusQueryDto[]> {
    return (await this.metric.findAll()).map((x) => x.intoDto());
  }

  @Get(":name")
  @ApiResponse({
    status: 200,
    type: PrometheusQueryDto,
    description: "Show info about one metric watched by this instance.",
  })
  async findOne(@Param("name") name: string): Promise<PrometheusQueryDto> {
    const n = await this.metric.get(name);
    if (!n) {
      throw new NotFoundException();
    }

    return n.intoDto();
  }

  @Put()
  async create(
    @Body() body: CreatePrometheusQueryDto,
  ): Promise<PrometheusQueryDto> {
    return (await this.metric.create(body)).intoDto();
  }

  @Delete(":id")
  async remove(@Param("id", ParseIntPipe) id: number): Promise<void> {
    await this.metric.removeById(id);
  }
}
