import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import * as Joi from "joi";
import configuration from "./configuration";
import { AppConfigService } from "./configuration.service";

const validationSchema = Joi.object({
  APP_NAME: Joi.string().default("Talib"),
  APP_ENV: Joi.string()
    .valid("development", "production", "test", "provision")
    .default("development"),
  APP_URL: Joi.string().uri({ allowRelative: false }),
  APP_PORT: Joi.number().default(3000),
  APP_DEBUG: Joi.boolean().default(false),
});

/**
 * Import and provide app configuration related classes.
 *
 * @module
 */
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      expandVariables: true,
      validationSchema,
    }),
  ],
  providers: [ConfigService, AppConfigService],
  exports: [ConfigService, AppConfigService],
})
export class AppConfigModule {}
