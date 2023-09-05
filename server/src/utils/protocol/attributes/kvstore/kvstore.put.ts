import { Address } from "@liftedinit/many-js";
import { parseAddress } from "../../../cbor-parsers";
import { Analyzer } from "../../analyzer";

interface ArgumentT {
  key: string;
  value: string;
  owner: string;
}

type ResultT = null;

interface EventT {
  key: string;
  value: string;
  owner: string;
}

export class KvstorePutAnalyzer extends Analyzer<ArgumentT, ResultT, EventT> {
  static method = "kvstore.put";
  static eventType = [7, 0];

  parseArgs(sender: Address, payload: Map<any, any>): ArgumentT {
    return {
      key: payload.get(1),
      value: payload.get(2),
      owner: (parseAddress(payload.get(3), true) || sender).toString(),
    };
  }

  analyzeResponse() {
    return null;
  }

  analyzeEvent(payload: Map<any, any>): EventT {
    return {
      key: payload.get(1).toString(),
      value: payload.get(2).toString(),
      owner: parseAddress(payload.get(3)).toString(),
    };
  }
}
