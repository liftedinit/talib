import { Controller, Get, Logger } from "@nestjs/common";
import { ApiExcludeController, ApiResponse } from "@nestjs/swagger";
import { oneLine } from "common-tags";
import { MetricsSchedulerService } from "./metrics-scheduler.service";

@ApiExcludeController()
@Controller("metricsScheduler")
export class MetricsSchedulerController {
  private readonly logger = new Logger(MetricsSchedulerController.name);

  constructor(private scheduler: MetricsSchedulerService) {}

  @Get("run")
  @ApiResponse({
    status: 200,
    description: oneLine`
      Run the scheduler manually. If the scheduler is already running,
      this does nothing.
    `,
  })
  async run(): Promise<""> {
    // We run the scheduler as a separate job, but ignore the results.
    // Do not wait on the scheduler. Scheduler runs can take minutes...
    this.scheduler.run().then(null, (err) => this.logger.error(err));
    return "";
  }
}
