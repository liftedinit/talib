import { Injectable, ForbiddenException, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { HttpService } from "@nestjs/axios";
import { map, catchError, lastValueFrom } from "rxjs";
import { PrometheusQuery } from "../../database/entities/prometheus-query.entity";
import { PrometheusConfigService } from "../../config/prometheus/configuration.service";
import { Repository } from "typeorm";

@Injectable()
export class PrometheusQueryDetailsService {
  private readonly logger = new Logger(PrometheusQueryDetailsService.name);

  constructor(
    private prometheusConfig: PrometheusConfigService,
    @InjectRepository(PrometheusQuery)
    private prometheusQueryRepository: Repository<PrometheusQuery>,
    private httpService: HttpService,
  ) {}

  async getPrometheusQuery(name: string): Promise<PrometheusQuery> {
    const query = this.prometheusQueryRepository
      .createQueryBuilder("n")
      .where({ name: name })
      .groupBy("n.id")
      .limit(1);

    // this.logger.debug(`getPrometheusQuery(${name}): \`${query.getQuery()}\``);
    const one = await query.getOne();

    if (!one) {
      return null;
    }

    return one;
  }

  constructGrafanaQuery(
    prometheusQuery: string,
    from: string,
    to: string,
    intervalMs: number,
    maxDataPoints: number,
  ) {
    const template = {
      queries: [
        {
          refId: "A",
          range: true,
          datasource: {
            type: "prometheus",
            uid: this.prometheusConfig.promDatasourceId,
          },
          expr: "",
          intervalMs: intervalMs,
          maxDataPoints: maxDataPoints,
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

  async getPrometheusQueryCurrentValue(
    name: string,
    from: string,
    to: string,
    intervalMs: number,
    maxDataPoints: number,
  ): Promise<any> {
    const getPrometheusQuery = await this.getPrometheusQuery(name);

    // this.logger.debug(`getPrometheusQuery(${name}): \`${JSON.stringify(getPrometheusQuery)}\``);

    return await lastValueFrom(
      this.httpService
        .post(
          this.prometheusConfig.remoteApiUrl,
          this.constructGrafanaQuery(
            getPrometheusQuery.query,
            from,
            to,
            intervalMs,
            maxDataPoints,
          ),
          {
            headers: {
              Authorization: `Basic ${Buffer.from(
                `${this.prometheusConfig.username}:${this.prometheusConfig.password}`,
              ).toString("base64")}`,
            },
          },
        )
        .pipe(
          map((res) => {
            const timestamps = res.data?.results.A.frames[0].data.values[0];
            const values = res.data?.results.A.frames[0].data.values[1];
            const latestTimestamp = timestamps[timestamps.length - 1];
            const latestValue = values[values.length - 1];
            const metrics: Array<any> = [latestTimestamp, latestValue];
            this.logger.debug(
              `metrics(${name}): \`${JSON.stringify(metrics)}\``,
            );
            return metrics;
          }),
        )
        .pipe(
          catchError(() => {
            throw new ForbiddenException("API not available");
          }),
        ),
    );
  }

  async getPrometheusQuerySeries(
    name: string,
    from: string,
    to: string,
    intervalMs: number,
    maxDataPoints: number,
  ) {
    const getPrometheusQuery = await this.getPrometheusQuery(name);
    return this.httpService
      .post(
        this.prometheusConfig.remoteApiUrl,
        this.constructGrafanaQuery(
          getPrometheusQuery.query,
          from,
          to,
          intervalMs,
          maxDataPoints,
        ),
        {
          headers: {
            Authorization: `Basic ${Buffer.from(
              `${this.prometheusConfig.username}:${this.prometheusConfig.password}`,
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
        catchError((error) => {
          console.log("Error:", error.message);
          throw new ForbiddenException("API not available");
        }),
      );
  }
}
