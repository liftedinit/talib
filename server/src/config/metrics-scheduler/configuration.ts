import { registerAs } from "@nestjs/config";
import * as process from "process";

export default registerAs("metricsScheduler", () => ({
  cron: process.env.METRICS_SCHEDULER_CRON,
  seconds: process.env.METRICS_SCHEDULER_SECONDS,
  max_blocks: process.env.METRICS_SCHEDULER_MAX_BLOCK,
  parallel: process.env.METRICS_SCHEDULER_PARALLEL,
  parallel_sleep: process.env.METRICS_SCHEDULER_PARALLEL_SLEEP,
}));
