import { Injectable, ForbiddenException, Logger } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { map, catchError } from "rxjs";
import * as process from "process";

const username = process.env.GRAFANA_USERNAME;
const password = process.env.GRAFANA_PASSWORD;

@Injectable()
export class MetricDetailsService {
  private readonly logger = new Logger(MetricDetailsService.name);

  constructor(private httpService: HttpService) {}

  async getCurrentNodeCount() {

    const remoteApiUrl = "https://grafana.liftedinit.tech/api/ds/query";
    const prometheusQuery = {
      queries: [
        {
          refId: "A",
          range: true,
          expr: 'count(netdata_info{manifest_network="true"})',
          datasource: {
            type: "prometheus",
            uid: "mJZsR1d4z",
          },
          utcOffsetSec: -18000,
          format: "json",
          maxDataPoints: 1987,
          intervalMs: 15000,
          stringInput: "1,20,90,30,5,0",
        },
      ],
      from: "now-5m",
      to: "now",
    };

    return this.httpService
      .post(remoteApiUrl, prometheusQuery, {
        headers: {
          Authorization: `Basic ${Buffer.from(
            `${username}:${password}`,
          ).toString("base64")}`,
        },
      })
      .pipe(map((res) => res.data?.results.A.frames[0].data.values[1][0]))
      .pipe(
        catchError(() => {
          throw new ForbiddenException("API not available");
        }),
      );
  }
}
