import { Controller, Get, Logger } from "@nestjs/common";
import { ApiExcludeController, ApiResponse } from "@nestjs/swagger";
import { oneLine } from "common-tags";
import { GeoSchedulerService } from "./geo-scheduler.service";

@ApiExcludeController()
@Controller("geoScheduler")
export class GeoSchedulerController {
  private readonly logger = new Logger(GeoSchedulerController.name);

  constructor(private scheduler: GeoSchedulerService) {}

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
 