import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Query,
  Logger,
} from "@nestjs/common";
import { ApiResponse } from "@nestjs/swagger";
import { SystemWideService } from "./systemwide.service";

@Controller("metrics/systemwide")
export class SystemWideController {
  private readonly logger = new Logger(SystemWideController.name);

  constructor(
    private systemwide: SystemWideService,
  ) {}

  @Get(":name/current")
  @ApiResponse({
    status: 200,
    description: "Show info for current systemwide metric value by name",
  })
  async getFrames(
    @Param("name") name: string,
  ) {
    const c = await this.systemwide.getCurrent(name);

    if (!c) {
      throw new NotFoundException();
    }

    return c;
  }
}
