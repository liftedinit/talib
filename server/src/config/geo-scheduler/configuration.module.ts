import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { CronTime } from "cron";
import * as Joi from "joi";
import configuration from "./configuration";
import { GeoSchedulerConfigService } from "./configuration.service";

const validationSchema = Joi.object({
  GEO_SCHEDULER_CRON: Joi.custom((value, helper) => {
    new CronTime(value);
    return value;
  }),
  GEO_SCHEDULER_STARTDATE_TIMESTAMP: Joi.number(),
  GEO_SCHEDULER_BATCH_SIZE: Joi.number(),
  GEO_SCHEDULER_MIN_BATCH_SIZE: Joi.number(),
  GEO_SCHEDULER_INTERVAL: Joi.number(),
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
  providers: [ConfigService, GeoSchedulerConfigService],
  exports: [ConfigService, GeoSchedulerConfigService],
})
export class GeoSchedulerConfigModule {}
