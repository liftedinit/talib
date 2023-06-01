import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

/**
 * Service dealing with app config based operations.
 *
 * @class
 */
@Injectable()
export class AdminConfigService {
  constructor(private configService: ConfigService) {}

  get username() {
    return this.configService.get<string>("admin.username");
  }
  get password() {
    return this.configService.get<string>("admin.password");
  }
}
