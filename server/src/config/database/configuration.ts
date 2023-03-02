import { registerAs } from "@nestjs/config";
import { camelCase } from "change-case";
import process from "process";

const kPrefix = "DATABASE_";

export default registerAs("database", () => {
  const all: Record<string, any> = {};
  const allKeys = Object.getOwnPropertyNames(process.env).filter(
    (x) =>
      x.startsWith(kPrefix) && !["DATABASE_TYPE", "DATABASE_EXTRA"].includes(x),
  );

  for (const key of allKeys) {
    all[camelCase(key.slice(kPrefix.length))] = process.env[key];
  }

  if (process.env.DATABASE_EXTRA !== undefined) {
    all.extra = JSON.parse(process.env.DATABASE_EXTRA);
  }

  return {
    type: process.env.DATABASE_TYPE,
    ...all,
  };
});
