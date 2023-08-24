import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, QueryFailedError } from "typeorm";
import { MetricsSchedulerConfigService } from "src/config/metrics-scheduler/configuration.service";
import { Metric } from "../../../database/entities/metric.entity";
import { Neighborhood } from "../../../database/entities/neighborhood.entity";
import { NeighborhoodInfo } from "../../../database/entities/neighborhood-info.entity";
// import { PrometheusQuery } from "src/database/entities/prometheus-query.entity";
import { MetricsService } from "../../../metrics/metrics.service";
// import { PrometheusQueryDetailsService } from "src/metrics/prometheus-query-details/query-details.service";
import { NeighborhoodService } from "../../../neighborhoods/neighborhood.service";
import { NetworkService } from "../../network.service";

@Injectable()
export class BlockHeightUpdater {
  private logger: Logger;
  private n: Neighborhood;
  private bh: NeighborhoodInfo;

  constructor(
    private schedulerConfig: MetricsSchedulerConfigService,
    private network: NetworkService,
    private neighborhood: NeighborhoodService,
    private metric: MetricsService,
    @InjectRepository(Metric)
    private metricRepository: Repository<Metric>,
  ) {}

  with(n: Neighborhood) {
    this.n = n;
    this.logger = new Logger(`${BlockHeightUpdater.name}(${n.id})`);
    return this;
  }

  // Seed blockheight table with values
  // This is the main job of the metrics scheduler
  private async seedBlockHeightValues(n: Neighborhood) {
    // Get date of last metric for PrometheusQuery

    return null;
  }

  async run() {
    const n = this.n;
    try {
      this.logger.debug(`seeding blockheight for network: ${n.name}`);
      // await this.seedBlockHeightValues(n);
    } catch (e) {
      this.logger.log(
        `Error happened while updating blockheight for network ${n.name}:\n${e.stack}`,
      );
    }
  }
}
