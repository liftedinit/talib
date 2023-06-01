import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

/**
 * Service dealing with app config based operations.
 *
 * @class
 */
@Injectable()
export class JwtConfigService {
  constructor(private configService: ConfigService) {}

  get secret() {
    return this.configService.get<string>("jwt.secret");
  }
}
