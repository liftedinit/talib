import { registerAs } from "@nestjs/config";
import * as process from "process";

export default registerAs("app", () => ({
  env: process.env.APP_ENV,
  name: process.env.APP_NAME,
  url: process.env.APP_URL,
  port: process.env.APP_PORT,
  debug: process.env.APP_DEBUG == "true" || process.env.APP_DEBUG == "1",
  staticRoot: process.env.APP_STATIC_ROOT,
}));
