import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import * as Joi from "joi";
import configuration from "./configuration";
import { AdminConfigService } from "./configuration.service";

const validationSchema = Joi.object({
  ADMIN_USERNAME: Joi.string().required(),
  ADMIN_PASSWORD: Joi.string().required(),
});

/**
 * Import and provide admin configuration related classes.
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
  providers: [ConfigService, AdminConfigService],
  exports: [ConfigService, AdminConfigService],
})
export class AdminConfigModule {}
