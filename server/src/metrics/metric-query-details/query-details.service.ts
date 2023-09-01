import { Injectable, ForbiddenException, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { HttpService } from "@nestjs/axios";
import { map, catchError, lastValueFrom } from "rxjs";
import { MetricQuery } from "../../database/entities/metric-query.entity";
import { PrometheusConfigService } from "../../config/prometheus/configuration.service";
import { Metric } from "../../database/entities/metric.entity";
import { Repository } from "typeorm";

@Injectable()
export class MetricQueryDetailsService {
  private readonly logger = new Logger(MetricQueryDetailsService.name);

  constructor(
    private prometheusConfig: PrometheusConfigService,
    @InjectRepository(MetricQuery)
    private prometheusQueryRepository: Repository<MetricQuery>,
    @InjectRepository(Metric)
    private metricRepository: Repository<Metric>,
    private httpService: HttpService,
  ) {}

  async getMetricQuery(name: string): Promise<MetricQuery> {
    const query = this.prometheusQueryRepository
      .createQueryBuilder("n")
      .where({ name: name })
      .groupBy("n.id")
      .limit(1);

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

  async getMetricQueryCurrentValue(
    name: string,
    from: string,
    to: string,
    intervalMs: number,
    maxDataPoints: number,
  ): Promise<any> {
    const getMetricQuery = await this.getMetricQuery(name);

    return await lastValueFrom(
      this.httpService
        .post(
          this.prometheusConfig.remoteApiUrl,
          this.constructGrafanaQuery(
            getMetricQuery.query,
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

  async getMetricQuerySeries(
    name: string,
    from: string,
    to: string,
    intervalMs: number,
    maxDataPoints: number,
  ) {
    const getMetricQuery = await this.getMetricQuery(name);
    return this.httpService
      .post(
        this.prometheusConfig.remoteApiUrl,
        this.constructGrafanaQuery(
          getMetricQuery.query,
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

  async getMetricQuerySingleValue(
    name: string,
    timestamp: number,
    intervalMs: number,
    maxDataPoints: number,
  ): Promise<any> {
    const getMetricQuery = await this.getMetricQuery(name);
    const from = timestamp - 300000;
    const to = timestamp;
    const latestMetric = await this.getLatestMetric(name);

    return await lastValueFrom(
      this.httpService
        .post(
          this.prometheusConfig.remoteApiUrl,
          this.constructGrafanaQuery(
            getMetricQuery.query,
            from.toString(),
            to.toString(),
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
            let latestTimestamp: number;
            let latestValue: number;
            const timestamps = res.data?.results.A.frames[0].data.values[0];
            const values = res.data?.results.A.frames[0].data.values[1];

            if (values === undefined || timestamps === undefined) {
              this.logger.debug(
                `Undefined values or timestamps for query: ${name}`,
              );
              // Set timestamp to 5 minutes ago to preserve interval
              latestTimestamp = from;
              latestValue = Number(latestMetric.data);
            } else {
              latestTimestamp = timestamps[timestamps.length - 1];
              latestValue = values[values.length - 1];
            }
            const metrics: Array<any> = [latestTimestamp, latestValue];

            return metrics;
          }),
        )
        .pipe(
          catchError((error: Error) => {
            this.logger.error(`Error for query ${name}: ${error.message}`);
            throw new ForbiddenException(error.message);
          }),
        ),
    );
  }

  async getLatestMetric(name: string): Promise<Metric | null> {
    const prometheusQueryId = await this.getMetricQuery(name);
    let latestMetric: Metric;

    try {
      latestMetric = await this.metricRepository
        .createQueryBuilder("m")
        .where({ prometheusQueryId: prometheusQueryId.id })
        .orderBy("m.timestamp", "DESC")
        .getOne();
    } catch (error) {
      this.logger.debug(`Error in fetching latest value: ${error}`);
    }

    return latestMetric;
  }
}
