import { Address } from "@liftedinit/many-js";
import { parseAddress, parseMemo } from "../../../cbor-parsers";
import { MethodAnalyzer } from "../../method-analyzer";

export interface LedgerSendTx {
  from: string;
  to: string;
  amount: number;
  symbol: string;
  memo?: string[];
}

export class LedgerSendAnalyzer extends MethodAnalyzer<LedgerSendTx, null> {
  static method = "ledger.send";
  static eventType = [6, 0];

  parseArgs(sender: Address, payload: Map<any, any>): LedgerSendTx {
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
}
