import { Message, NetworkModule } from "@liftedinit/many-js";
import { BufferLike } from "../buffer";
import { parseDateTime } from "../cbor-parsers";

export interface BlockIdentifier {
  hash: BufferLike;
  height: number;
}

export interface BlockchainInfo {
  latestBlock: BlockIdentifier;
  appHash: BufferLike;
  retainedHeight: number | undefined;
}

export interface Block {
  identifier: BlockIdentifier;
  parent: BlockIdentifier | null;
  appHash: BufferLike;
  time: Date;
  txCount: number;
  transactions: Transaction[];
}

export interface Transaction {
  hash: BufferLike;
  request?: BufferLike;
  response?: BufferLike;
}

export interface Blockchain extends NetworkModule {
  info(): Promise<BlockchainInfo>;
  blockByHeight(height: number): Promise<Block>;
  request(txHash: BufferLike): Promise<BufferLike>;
  response(txHash: BufferLike): Promise<BufferLike>;
}

export const Blockchain: Blockchain = {
  _namespace_: "blockchain",

  async info() {
    const msg = await this.call("blockchain.info");
    return parseBlockchainInfo(msg);
  },

  async blockByHeight(height: number) {
    const param = new Map([[0, new Map([[1, height]])]]);
    const msg = await this.call("blockchain.block", param);
    return parseBlock(msg);
  },

  async request(txHash: BufferLike): Promise<BufferLike> {
    const param = new Map([[0, new Map([[0, txHash]])]]);
    const msg = await this.call("blockchain.request", param);
    const payload = msg.getPayload();
    if (!(payload instanceof Map)) {
      throw new Error("Invalid message");
    }
    return payload.get(0) as BufferLike;
  },

  async response(txHash: BufferLike): Promise<BufferLike> {
    const param = new Map([[0, new Map([[0, txHash]])]]);
    const msg = await this.call("blockchain.response", param);
    const payload = msg.getPayload();
    if (!(payload instanceof Map)) {
      throw new Error("Invalid message");
    }
    return payload.get(0) as BufferLike;
  },
};

function parseBlockIdentifier(id: Map<number, any>): BlockIdentifier {
  return {
    hash: id.get(0),
    height: id.get(1),
  };
}

function parseBlockchainInfo(msg: Message): BlockchainInfo {
  const content = msg.getPayload();
  if (!(content instanceof Map)) {
    throw new Error("Invalid message");
  }

  return {
    appHash: content.get(1),
    retainedHeight: content.get(2),
    latestBlock: parseBlockIdentifier(content.get(0)),
  };
}

function parseTransactionFromBlock(msg: Map<any, any>): Transaction {
  // Get identifier
  const id = msg.get(0);
  const txHash = id.get(0);

  return {
    hash: txHash,
    request: undefined,
    response: undefined,
  };
}

function parseBlock(msg: Message): Block {
  const payload = msg.getPayload();
  if (!(payload instanceof Map)) {
    throw new Error("Invalid message");
  }
  const content = payload.get(0);

  const maybeParent = content.get(1);
  const appHash = new Uint8Array([...content.get(2)]);
  const time = parseDateTime(content.get(3));

  return {
    identifier: parseBlockIdentifier(content.get(0)),
    parent: maybeParent ? parseBlockIdentifier(maybeParent) : null,
    appHash,
    time,
    txCount: Number(content.get(4)),
    transactions: content.get(5).map(parseTransactionFromBlock),
  };
}
