import { Injectable, ForbiddenException, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { HttpService } from "@nestjs/axios";
import { map, catchError, lastValueFrom } from "rxjs";
import { PrometheusQuery } from "../../database/entities/prometheus-query.entity";
import { PrometheusConfigService } from "../../config/prometheus/configuration.service";
import { Metric } from "../../database/entities/metric.entity";
import { Repository } from "typeorm";

@Injectable()
export class PrometheusQueryDetailsService {
  private readonly logger = new Logger(PrometheusQueryDetailsService.name);

  constructor(
    private prometheusConfig: PrometheusConfigService,
    @InjectRepository(PrometheusQuery)
    private prometheusQueryRepository: Repository<PrometheusQuery>,
    @InjectRepository(Metric)
    private metricRepository: Repository<Metric>,
    private httpService: HttpService,
  ) {}


  createAuthorizationHeader(prometheusConfig: PrometheusConfigService): any {
    const username = prometheusConfig.username;
    const password = prometheusConfig.password;
    const credentials = `${username}:${password}`;
    const base64Credentials = Buffer.from(credentials).toString("base64");
  
    return {
      headers: {
        Authorization: `Basic ${base64Credentials}`,
      },
    };
  }

  async getPrometheusQuery(name: string): Promise<PrometheusQuery> {
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

  async getPrometheusQueryCurrentValue(
    name: string,
    from: string,
    to: string,
    intervalMs: number,
    maxDataPoints: number,
  ): Promise<any> {
    const getPrometheusQuery = await this.getPrometheusQuery(name);

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
          this.createAuthorizationHeader(this.prometheusConfig),
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
        this.createAuthorizationHeader(this.prometheusConfig),
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

  async getPrometheusQuerySingleValue(
    name: string,
    timestamp: number,
    intervalMs: number,
    maxDataPoints: number,
    injectLabels?: { label: string; value: string }[]
  ): Promise<any> {
    const getPrometheusQuery = await this.getPrometheusQuery(name);
    const from = timestamp - 300000;
    const to = timestamp;
    const latestMetric = await this.getLatestMetric(name);

    // if injectLabel is defined, inject it into the query
    if (injectLabels) {
      const labels = injectLabels.map(item => `${item.label}="${item.value}"`).join(", ");
      getPrometheusQuery.query = getPrometheusQuery.query.replace(
        /}/,
        `, ${labels}}`
      );
    }

    return await lastValueFrom(
      this.httpService
        .post(
          this.prometheusConfig.remoteApiUrl,
          this.constructGrafanaQuery(
            getPrometheusQuery.query,
            from.toString(),
            to.toString(),
            intervalMs,
            maxDataPoints,
          ),
          this.createAuthorizationHeader(this.prometheusConfig),
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

              this.logger.debug(`timestamp: ${JSON.stringify(latestTimestamp)}`)
              this.logger.debug(`value: ${JSON.stringify(latestValue)}`)
            } else {
              latestTimestamp = timestamps[timestamps.length - 1];
              latestValue = values[values.length - 1];

              this.logger.debug(`timestamp: ${JSON.stringify(latestTimestamp)}`)
              this.logger.debug(`value: ${JSON.stringify(latestValue)}`)
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

  async getPrometheusQueryCurrentFrames(
    name: string,
    timestamp: number,
    intervalMs: number,
    maxDataPoints: number,
  ): Promise<any> {
    const getPrometheusQuery = await this.getPrometheusQuery(name);
    const from = timestamp - 3000000;
    const to = timestamp;

    return await lastValueFrom(
      this.httpService
        .post(
          this.prometheusConfig.remoteApiUrl,
          this.constructGrafanaQuery(
            getPrometheusQuery.query,
            from.toString(),
            to.toString(),
            intervalMs,
            maxDataPoints,
          ),
          this.createAuthorizationHeader(this.prometheusConfig),
        )
        .pipe(
          map((res) => {
            const results = res.data?.results.A;

            let latestTimestamp: number;
            let latestValue: number;
            let metrics: Array<any> = [];

            for (let i = 0; i < results.frames.length; i++) {
              const frame = results.frames[i];

              const timestamps = frame.data.values[0];
              const values = frame.data.values[1];
              const instance = frame.schema.fields[1].labels.instance;

              latestTimestamp = timestamps[timestamps.length - 1];
              latestValue = values[values.length - 1];

              metrics.push([latestTimestamp, latestValue, instance]);

            }

            // this.logger.debug(`metrics: ${JSON.stringify(metrics)}`);

            return metrics;
          }),
        )
        .pipe(
          catchError((error: Error) => {
            this.logger.error(`Error for query ${name}: ${error.message}`);
            throw new ForbiddenException(error.message);
          }),
        )
    );
  }

  async getLatestMetric(name: string): Promise<Metric | null> {
    const prometheusQueryId = await this.getPrometheusQuery(name);
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
