import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Query,
  ParseIntPipe,
  Put,
  Logger,
} from "@nestjs/common";
import {
  PrometheusQueryDto,
  CreatePrometheusQueryDto,
} from "../../dto/prometheus-query.dto";
import { ApiResponse } from "@nestjs/swagger";
import { PrometheusQueryDetailsService } from "../prometheus-query-details/query-details.service";

@Controller("prometheusquerydetails")
export class PrometheusQueryDetailsController {
  private readonly logger = new Logger(PrometheusQueryDetailsController.name);

  constructor(private queryDetails: PrometheusQueryDetailsService) {}

  @Get(":name/single")
  @ApiResponse({
    status: 200,
    // type: PrometheusQueryDto,
    description: "Show info about one metric watched by this instance.",
  })
  async findOne(
    @Query("name") name: string,
    @Query("timestamp") timestamp: number,
    @Query("intervalMs") intervalMs: number,
    @Query("maxDataPoints") maxDataPoints: number,
  ): Promise<any> {
    const n = await this.queryDetails.getPrometheusQuerySingleValue(name, timestamp, intervalMs, maxDataPoints);
    if (!n) {
      throw new NotFoundException();
    }

    return n;
  }

  @Get(":name/frames")
  @ApiResponse({
    status: 200,
    // type: PrometheusQueryDto,
    description: "Show info for current metric values including all frames for a query watched by this instance.",
  })
  async getFrames(
    @Param("name") name: string,
    @Query("timestamp") timestamp: number,
    @Query("intervalMs") intervalMs: number,
    @Query("maxDataPoints") maxDataPoints: number,
  ) {
    const f = await this.queryDetails.getPrometheusQueryCurrentFrames(name, timestamp, intervalMs, maxDataPoints );

    this.logger.debug(f);
    if (!f) {
      throw new NotFoundException();
    }

    return f;
  }


}
