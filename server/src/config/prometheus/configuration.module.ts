import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import * as Joi from "joi";
import configuration from "./configuration";
import { PrometheusConfigService } from "./configuration.service";

const validationSchema = Joi.object({
  GRAFANA_USERNAME: Joi.string(),
  GRAFANA_PASSWORD: Joi.string(),
  GRAFANA_API_URL: Joi.string(),
  PROMETHEUS_DATASOURCE_ID: Joi.string(),
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
  providers: [ConfigService, PrometheusConfigService],
  exports: [ConfigService, PrometheusConfigService],
})
export class PrometheusConfigModule {}
