import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

/**
 * Service dealing with app config based operations.
 *
 * @class
 */
@Injectable()
export class DatabaseConfigService {
  constructor(private configService: ConfigService) {}

  get type() {
    return this.configService.get<string>("database.type");
  }

  get config(): Record<string, any> {
    return this.configService.get("database");
  }
}
