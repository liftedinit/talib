import { Message, NetworkModule } from '@liftedinit/many-js';
import cbor from 'cbor';

export interface BlockchainInfo {
  id: {
    hash: ArrayBuffer;
    height: number;
  };
  appHash: ArrayBuffer;
  retainedHeight: number | undefined;
}

export interface Blockchain extends NetworkModule {
  info(): Promise<BlockchainInfo>;
}

export const Blockchain: Blockchain = {
  _namespace_: 'blockchain',

  async info() {
    const msg = await this.call('blockchain.info');
    return parseBlockchainInfo(msg);
  },
};

function parseBlockchainInfo(msg: Message): BlockchainInfo {
  const content = msg.getPayload();
  if (!(content instanceof Map)) {
    throw new Error('Invalid message');
  }

  const id = content.get(0);

  return {
    appHash: content.get(1),
    retainedHeight: content.get(2),
    id: {
      hash: id.get(0),
      height: id.get(1),
    },
  };
}
