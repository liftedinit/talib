import { registerAs } from "@nestjs/config";
import * as process from "process";

export default registerAs("prometheus", () => ({
  username: process.env.GRAFANA_USERNAME,
  password: process.env.GRAFANA_PASSWORD,
  remoteApiUrl: process.env.GRAFANA_API_URL + "/api/ds/query",
  promDatasourceId: process.env.PROMETHEUS_DATASOURCE_ID,
}));
