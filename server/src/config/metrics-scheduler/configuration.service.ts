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

  get maxBlocks() {
    return Number(this.configService.get<number>("metricsScheduler.max_blocks"));
  }

  get parallel() {
    return Number(this.configService.get<number>("metricsScheduler.parallel"));
  }

  get parallelSleep() {
    return Number(this.configService.get<number>("metricsScheduler.parallel_sleep"));
  }
}
