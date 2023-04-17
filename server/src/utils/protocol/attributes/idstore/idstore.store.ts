import { Address } from "@liftedinit/many-js";
import * as cbor from "cbor";
import { parseAddress, parseBuffer } from "../../../cbor-parsers";
import { bufferToHex } from "../../../convert";
import { Analyzer, tags } from "../../analyzer";

export interface IdStoreStoreTx {
  address: string;
  // Hexadecimal buffer.
  credentials: string;
  // Hexadecimal buffer.
  publicKey: string;
}

export interface IdStoreStoreResult {
  recallPhrase: string[];
}

export class IdStoreStore extends Analyzer<
  IdStoreStoreTx,
  IdStoreStoreResult,
  never
> {
  static method = "idstore.store";

  parseArgs(sender: Address, payload: Map<any, any>): IdStoreStoreTx {
    return {
      address: (
        parseAddress(payload.get(0), true) || Address.anonymous()
      ).toString(),
      credentials: bufferToHex(parseBuffer(payload.get(1))),
      publicKey: bufferToHex(parseBuffer(payload.get(2))),
    };
  }

  async analyzeResponse(data: Buffer): Promise<IdStoreStoreResult> {
    const payload = await cbor.decodeFirst(data, { tags });

    return {
      recallPhrase: payload.get(0),
    };
  }

  analyzeEvent(payload: Map<any, any>): never {
    throw new Error("Not implemented");
  }
}
