import { registerAs } from "@nestjs/config";
import * as process from "process";

export default registerAs("app", () => ({
  env: process.env.APP_ENV,
  name: process.env.APP_NAME,
  url: process.env.APP_URL,
  port: process.env.APP_PORT,
  corsOrigin: process.env.APP_CORS_ORIGIN
    ? process.env.APP_CORS_ORIGIN.split(",").map((o) => o.trim())
    : "*",
  debug: process.env.APP_DEBUG == "true" || process.env.APP_DEBUG == "1",
  staticRoot: process.env.APP_STATIC_ROOT,
}));
