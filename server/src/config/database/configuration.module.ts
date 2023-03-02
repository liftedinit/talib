import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import * as Joi from "joi";
import configuration from "./configuration";
import { DatabaseConfigService } from "./configuration.service";

const validationSchema = Joi.object({
  DB_TYPE: Joi.string().required(),
}).pattern(/^DB_/, Joi.string());

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
  providers: [ConfigService, DatabaseConfigService],
  exports: [ConfigService, DatabaseConfigService],
})
export class DatabaseConfigModule {}
