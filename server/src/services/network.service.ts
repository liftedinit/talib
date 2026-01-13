import { Base, Network as ManyNetwork } from "@liftedinit/many-js";
import { Injectable } from "@nestjs/common";
import { Blockchain } from "../utils/network/blockchain";
import { Events } from "../utils/network/events";
import { Ledger } from "../utils/network/ledger";

// Define the types
type N = ManyNetwork & {
  base: Base;
  blockchain: Blockchain;
  events: Events;
};

type NL = N & {
  ledger: Ledger;
};

export type NetworkType = "ledger" | "kvstore" | undefined;

@Injectable()
export class NetworkService {
  private cache = new Map<string, N | NL>();

  async forUrl(url: string, networkType?: string): Promise<N | NL> {
    const cacheKey = `${url}:${networkType || 'default'}`;
    const maybeNetwork = this.cache.get(cacheKey);
    if (maybeNetwork) {
      return maybeNetwork;
    }

    if (networkType === 'ledger') {
      const networkWithLedger = new ManyNetwork(url);
      networkWithLedger.apply([Base, Blockchain, Events, Ledger]);
      this.cache.set(cacheKey, networkWithLedger as NL);
      return networkWithLedger as NL;
    }

    // Default case or other network types
    const network = new ManyNetwork(url);
    network.apply([Base, Blockchain, Events]);
    this.cache.set(cacheKey, network as N);
    return network as N;
  }
}