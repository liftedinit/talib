import { Address } from "@liftedinit/many-js";
import { parseAddress, parseMemo } from "../../../cbor-parsers";
import { Analyzer } from "../../analyzer";

interface ArgumentT {
  from: string;
  to: string;
  amount: number;
  symbol: string;
  memo?: string[];
}

type ResultT = null;

interface EventT {
  from: string;
  to: string;
  symbol: string;
  amount: string;
  memo?: string[];
}

export class LedgerSendAnalyzer extends Analyzer<ArgumentT, ResultT, EventT> {
  static method = "ledger.send";
  static eventType = [6, 0];

  parseArgs(sender: Address, payload: Map<any, any>): ArgumentT {
    return {
      from: (parseAddress(payload.get(0), true) || sender).toString(),
      to: parseAddress(payload.get(1)).toString(),
      amount: Number(payload.get(2)),
      symbol: parseAddress(payload.get(3)).toString(),
      memo: parseMemo(payload.get(4), true),
    };
  }

  analyzeResponse() {
    return null;
  }

  analyzeEvent(payload: Map<any, any>): EventT {
    return {
      from: parseAddress(payload.get(1)).toString(),
      to: parseAddress(payload.get(2)).toString(),
      symbol: parseAddress(payload.get(3)).toString(),
      amount: payload.get(4).toString(),
      memo: parseMemo(payload.get(5), true),
    };
  }
}
