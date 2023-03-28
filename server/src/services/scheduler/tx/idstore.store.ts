import { Address } from "@liftedinit/many-js";
import * as cbor from "cbor";
import { bufferToHex } from "../../../utils/convert";
import {
  MethodAnalyzer,
  parseAddress,
  parseBuffer,
  tags,
} from "../tx-analyzer.service";

export interface IdStoreStoreTx {
  address: string;
  // Hexadecimal buffer.
  credentials: string;
  // Hexadecimal buffer.
  publicKey: string;
}

export interface IdStoreStoreResult {
  recallPhrase: string;
}

export class IdStoreStore extends MethodAnalyzer<
  IdStoreStoreTx,
  IdStoreStoreResult
> {
  constructor() {
    super();
  }

  async analyzeRequest(sender: Address, data: Buffer): Promise<IdStoreStoreTx> {
    const payload = await cbor.decodeFirst(data, { tags });
    return {
      address: (
        parseAddress(payload.get(0), true) || Address.anonymous()
      ).toString(),
      credentials: bufferToHex(parseBuffer(payload.get(1))),
      publicKey: bufferToHex(parseBuffer(payload.get(2))),
    };
  }

  analyzeResponse() {
    return null;
  }
}
