import { registerAs } from "@nestjs/config";
import * as process from "process";

export default registerAs("jwt", () => ({
  secret: process.env.JWT_SECRET,
}));
