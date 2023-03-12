import { Controller, Get } from "@nestjs/common";
import { ApiResponse } from "@nestjs/swagger";
import { oneLine } from "common-tags";
import { SchedulerService } from "./scheduler.service";

@Controller("scheduler")
export class SchedulerController {
  constructor(private scheduler: SchedulerService) {}

  @Get("run")
  @ApiResponse({
    status: 200,
    description: oneLine`
      Run the scheduler manually. If the scheduler is already running,
      this does nothing.
    `,
  })
  async findAll(): Promise<void> {
    await this.scheduler.run();
  }
}
