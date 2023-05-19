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

  async getMetricCurrentValue(name: string) {
    const getPrometheusQuery = await this.getPrometheusQuery(name);

    return this.httpService
      .post(remoteApiUrl, JSON.parse(getPrometheusQuery.query), {
        headers: {
          Authorization: `Basic ${Buffer.from(
            `${username}:${password}`,
          ).toString("base64")}`,
        },
      })
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
}
