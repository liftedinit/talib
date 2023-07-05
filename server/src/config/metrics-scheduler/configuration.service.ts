import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

/**
 * Service dealing with app config based operations.
 *
 * @class
 */
@Injectable()
export class MetricsSchedulerConfigService {
  constructor(private configService: ConfigService) {}

  get cron() {
    return this.configService.get<string | undefined>("metricsScheduler.cron");
  }
  get seconds() {
    return this.configService.get<number | undefined>("metricsScheduler.seconds");
  }
  get enabled() {
    return this.cron !== undefined || this.seconds !== undefined;
  }

  get startdate_timestamp() {
    return Number(this.configService.get<number>("metricsScheduler.startdate_timestamp"));
  }

  get batch_size() {
    return Number(this.configService.get<number>("metricsScheduler.batch_size"));
  }

  get min_batch_size() {
    return Number(this.configService.get<number>("metricsScheduler.min_batch_size"));
  }

  get interval() {
    return Number(this.configService.get<number>("metricsScheduler.interval"));
  }
}
