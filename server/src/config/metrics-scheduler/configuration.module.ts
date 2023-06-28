import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { CronTime } from "cron";
import * as Joi from "joi";
import configuration from "./configuration";
import { MetricsSchedulerConfigService } from "./configuration.service";

const validationSchema = Joi.object({
  METRICS_SCHEDULER_CRON: Joi.custom((value, helper) => {
    new CronTime(value);
    return value;
  }),
  METRICS_SCHEDULER_SECONDS: Joi.number(),
  METRICS_SCHEDULER_STARTDATE_TIMESTAMP: Joi.number(),
  METRICS_SCHEDULER_BATCH_SIZE: Joi.number(),
  METRICS_SCHEDULER_INTERVAL: Joi.number(),
}).nand("METRICS_SCHEDULER_CRON", "METRICS_SCHEDULER_SECONDS");

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
  providers: [ConfigService, MetricsSchedulerConfigService],
  exports: [ConfigService, MetricsSchedulerConfigService],
})
export class MetricsSchedulerConfigModule {}
