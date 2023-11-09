import { registerAs } from "@nestjs/config";
import * as process from "process";

export default registerAs("geoScheduler", () => ({
  cron: process.env.GEO_SCHEDULER_CRON,
}));
