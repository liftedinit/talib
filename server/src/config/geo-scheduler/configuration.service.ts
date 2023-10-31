import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

/**
 * Service dealing with app config based operations.
 *
 * @class
 */
@Injectable()
export class GeoSchedulerConfigService {
  constructor(private configService: ConfigService) {}

  get cron() {
    return this.configService.get<string | undefined>("geoScheduler.cron");
  }
  
  get enabled() {
    return this.cron !== undefined;
  }

  get startdate_timestamp() {
    return Number(this.configService.get<number>("geoScheduler.startdate_timestamp"));
  }

  get batch_size() {
    return Number(this.configService.get<number>("geoScheduler.batch_size"));
  }

  get min_batch_size() {
    return Number(this.configService.get<number>("geoScheduler.min_batch_size"));
  }

  get interval() {
    return Number(this.configService.get<number>("geoScheduler.interval"));
  }
}
