import { Injectable } from '@nestjs/common';
import { Base, Network as ManyNetwork } from '@liftedinit/many-js';
import { Blockchain } from '../utils/blockchain';

type N = ManyNetwork & {
  base: Base;
  blockchain: Blockchain;
};

@Injectable()
export class NetworkService {
  private cache = new Map<string, N>();

  async forUrl(url: string): Promise<N> {
    const maybeNetwork = this.cache.get(url);
    if (maybeNetwork) {
      return maybeNetwork;
    }

    const network = new ManyNetwork(url);
    network.apply([Base, Blockchain]);
    this.cache.set(url, network as N);
    return network as N;
  }
}
