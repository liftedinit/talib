import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

/**
 * Service dealing with app config based operations.
 *
 * @class
 */
@Injectable()
export class PrometheusConfigService {
  constructor(private configService: ConfigService) {}

  get username() {
    return this.configService.get<string | undefined>("prometheus.username");
  }
  get password() {
    return this.configService.get<string | undefined>("prometheus.password");
  }
  get remoteApiUrl() {
    return this.configService.get<string>("prometheus.remoteApiUrl");
  }
  get promDatasourceId() {
    return this.configService.get<string>("prometheus.promDatasourceId");
  }
}
