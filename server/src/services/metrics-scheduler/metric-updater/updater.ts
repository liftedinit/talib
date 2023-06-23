import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { MetricsSchedulerConfigService } from "src/config/metrics-scheduler/configuration.service";
import { Metric } from "../../../database/entities/metric.entity";
import { PrometheusQuery } from "src/database/entities/prometheus-query.entity";
import { MetricsService } from "../../../metrics/metrics.service";
import { PrometheusQueryDetailsService } from "src/metrics/prometheus-query-details/query-details.service";
// import { MetricAnalyzerService } from "../metrics-analyzer.service";

const FROM = "now-5m";
const TO = "now";
const INTERVALMS = 30000;
const MAXDATAPOINTS = 3000;

@Injectable()
export class MetricUpdater {
  private logger: Logger;
  private p: PrometheusQuery;

  constructor(
    private schedulerConfig: MetricsSchedulerConfigService,
    private metric: MetricsService,
    private prometheusQueryDetails: PrometheusQueryDetailsService,
    // private metricAnalyzer: MetricAnalyzerService,
    @InjectRepository(Metric)
    private metricRepository: Repository<Metric>,
  ) {}

  with(p: PrometheusQuery) {
    this.p = p;
    this.logger = new Logger(`${MetricUpdater.name}(${p.id})`);
    return this;
  }

  private async updateMetricMissingEvents(p: PrometheusQuery) {
    const latestMetric =
      await this.prometheusQueryDetails.getPrometheusQueryCurrentValue(
        p.name,
        FROM,
        TO,
        INTERVALMS,
        MAXDATAPOINTS,
      );

    this.logger.debug(
      `latestMetric for ${p.name} = ${JSON.stringify(latestMetric)}`,
    );

    return latestMetric;
  }

  async run() {
    const p = this.p;
    // If we can't check if metrics has been reset, we probably won't be
    // able to check anything, so just skip blocks too.
    try {
      await this.updateMetricMissingEvents(p);
    } catch (e) {
      this.logger.log(`Error happened while updating metrics:\n${e.stack}`);
    }
  }
}
