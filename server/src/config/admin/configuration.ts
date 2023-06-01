import { registerAs } from "@nestjs/config";
import * as process from "process";

export default registerAs("admin", () => ({
  username: process.env.ADMIN_USERNAME,
  password: process.env.ADMIN_PASSWORD,
}));
