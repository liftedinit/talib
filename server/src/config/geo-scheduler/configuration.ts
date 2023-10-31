import { registerAs } from "@nestjs/config";
import * as process from "process";

export default registerAs("metricsScheduler", () => ({
  cron: process.env.GEO_SCHEDULER_CRON,
  startdate_timestamp: process.env.GEO_SCHEDULER_STARTDATE_TIMESTAMP,
  interval: process.env.GEO_SCHEDULER_INTERVAL,
  batch_size: process.env.GEO_SCHEDULER_BATCH_SIZE,
  min_batch_size: process.env.GEO_SCHEDULER_MIN_BATCH_SIZE,
}));
