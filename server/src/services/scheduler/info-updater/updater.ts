import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { SchedulerConfigService } from "../../../config/scheduler/configuration.service";
import { Event } from "../../../database/entities/event.entity";
import { Neighborhood } from "../../../database/entities/neighborhood.entity";
import { TransactionDetails } from "../../../database/entities/transaction-details.entity";
import { Transaction } from "../../../database/entities/transaction.entity";
import { NeighborhoodInfo } from "../../../database/entities/neighborhood-info.entity";
import { BlockService } from "../../../neighborhoods/blocks/block.service";
import { EventsService } from "../../../neighborhoods/events/events.service";
import { NeighborhoodService } from "../../../neighborhoods/neighborhood.service";
import { NeighborhoodInfoService } from "../../../neighborhoods/neighborhood-info/info.service";
import { TransactionsService } from "../../../neighborhoods/transactions/transactions.service";
import { NetworkService } from "../../network.service";

@Injectable()
export class NeighborhoodInfoUpdater {
  private logger: Logger;
  private n: Neighborhood;

  constructor(
    private schedulerConfig: SchedulerConfigService,
    private network: NetworkService,
    private neighborhood: NeighborhoodService,
    private block: BlockService,
    private transaction: TransactionsService,
    private events: EventsService,
    private neighborhoodInfo: NeighborhoodInfoService,
    @InjectRepository(TransactionDetails)
    private txDetailsRepository: Repository<TransactionDetails>,
  ) {}

  with(n: Neighborhood) {
    this.n = n;
    this.logger = new Logger(`${NeighborhoodInfoUpdater.name}(${n.id})`);
    return this;
  }

  private async updateNeighborhoodLatestBlockHeight(
    neighborhood: Neighborhood,
  ) {
    const network = await this.network.forUrl(neighborhood.url);
    const latestHeight = await this.block.getLatestHeightOf(neighborhood);

    // Update the neighborhood's latest block height

    this.logger.debug(
      `updateNeighborhoodLatestBlockHeight(${neighborhood.id}): ${latestHeight}`,
    );

    // info type: blockheight
    this.logger.debug(
      `updateCurrent(neighborhoodId: ${neighborhood.id}): value: ${latestHeight}`,
    );

    return null;
  }

  async run() {
    const n = this.n;

    // If we can't check if neighborhood has been reset, we probably won't be
    // able to check anything, so just skip blocks too.
    try {
      await this.updateNeighborhoodLatestBlockHeight(n);
    } catch (e) {
      this.logger.log(
        `Error happened while updating neighborhood blocks for neighborhood ${n.name}:\n${e.stack}`,
      );
    }
  }
}
