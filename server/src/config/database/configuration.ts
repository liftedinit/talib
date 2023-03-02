import { registerAs } from "@nestjs/config";
import { camelCase } from "change-case";
import process from "process";

export default registerAs("database", () => {
  const extra = {};
  const allKeys = Object.getOwnPropertyNames(process.env).filter(
    (x) => x.startsWith("DB_") && x != "DB_TYPE",
  );

  for (const key of allKeys) {
    extra[camelCase(key.slice(3))] = process.env[key];
  }

  const config = {
    type: process.env.DB_TYPE,
    extra,
  };

  return config;
});
