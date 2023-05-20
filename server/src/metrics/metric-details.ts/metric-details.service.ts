import { Injectable, ForbiddenException, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { HttpService } from "@nestjs/axios";
import { map, catchError } from "rxjs";
import * as process from "process";
import { Metric } from "../../database/entities/metric.entity";
import { Repository } from "typeorm";

const username = process.env.GRAFANA_USERNAME;
const password = process.env.GRAFANA_PASSWORD;
const remoteApiUrl = process.env.GRAFANA_API_URL + "/api/ds/query";

@Injectable()
export class MetricDetailsService {
  private readonly logger = new Logger(MetricDetailsService.name);

  constructor(
    @InjectRepository(Metric)
    private metricRepository: Repository<Metric>,
    private httpService: HttpService,
  ) {}

  async getPrometheusQuery(name: string): Promise<Metric> {
    const query = this.metricRepository
      .createQueryBuilder("n")
      .where({ name: name })
      .groupBy("n.id")
      .limit(1);

    this.logger.debug(`getPrometheusQuery(${name}): \`${query.getQuery()}\``);
    const one = await query.getOne();

    if (!one) {
      return null;
    }

    return one;
  }

  constructGrafanaQuery(prometheusQuery: string, from: string, to: string) {
    this.logger.debug(`${prometheusQuery}`);
    const template = {
      queries: [
        {
          refId: "A",
          range: true,
          datasource: {
            type: "prometheus",
            uid: "mJZsR1d4z",
          },
          expr: "",
          intervalMs: 15000,
          maxDataPoints: 3328,
        },
      ],
      from: "",
      to: "",
    };

    template.queries[0].expr = prometheusQuery;
    template.from = from;
    template.to = to;

    return template;
  }

  async getMetricCurrentValue(name: string, from: string, to: string) {
    const getPrometheusQuery = await this.getPrometheusQuery(name);

    return this.httpService
      .post(
        remoteApiUrl,
        this.constructGrafanaQuery(getPrometheusQuery.query, from, to),
        {
          headers: {
            Authorization: `Basic ${Buffer.from(
              `${username}:${password}`,
            ).toString("base64")}`,
          },
        },
      )
      .pipe(
        map((res) => {
          const values = res.data?.results.A.frames[0].data.values[1];
          const last = values[values.length - 1];
          return last;
        }),
      )
      .pipe(
        catchError(() => {
          throw new ForbiddenException("API not available");
        }),
      );
  }

  async getMetricSeries(name: string, from: string, to: string) {
    const getPrometheusQuery = await this.getPrometheusQuery(name);

    return this.httpService
      .post(
        remoteApiUrl,
        this.constructGrafanaQuery(getPrometheusQuery.query, from, to),
        {
          headers: {
            Authorization: `Basic ${Buffer.from(
              `${username}:${password}`,
            ).toString("base64")}`,
          },
        },
      )
      .pipe(
        map((res) => {
          const values = res.data?.results.A.frames[0].data.values;
          return values;
        }),
      )
      .pipe(
        catchError(() => {
          throw new ForbiddenException("API not available");
        }),
      );
  }
}
