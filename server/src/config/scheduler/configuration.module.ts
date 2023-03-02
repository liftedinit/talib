import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CronTime } from 'cron';
import * as Joi from 'joi';
import configuration from './configuration';
import { SchedulerConfigService } from './configuration.service';

const validationSchema = Joi.object({
  SCHEDULER_CRON: Joi.custom((value, helper) => {
    new CronTime(value);
    return value;
  }),
  SCHEDULER_SECONDS: Joi.number(),
  SCHEDULER_MAX_BLOCK: Joi.number(),
  SCHEDULER_PARALLEL: Joi.number(),
  SCHEDULER_PARALLEL_SLEEP: Joi.number(),
}).nand('SCHEDULER_CRON', 'SCHEDULER_SECONDS');

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
  providers: [ConfigService, SchedulerConfigService],
  exports: [ConfigService, SchedulerConfigService],
})
export class SchedulerConfigModule {}
