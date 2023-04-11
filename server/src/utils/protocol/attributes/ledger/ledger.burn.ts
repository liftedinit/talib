import { Address } from "@liftedinit/many-js";
import { parseAddress, parseMemo } from "../../../cbor-parsers";
import { MethodAnalyzer } from "../../method-analyzer";
import { parseTokenHolderMap, TokenHolderMapDto } from "../../tokens";

export interface Argument {
  symbol: string;
  amounts: TokenHolderMapDto;
  memo?: string[];
}

export class LedgerBurnAnalyzer extends MethodAnalyzer<Argument, null> {
  static method = "ledger.burn";
  static eventType = [12, 1];

  parseArgs(sender: Address, payload: Map<any, any>): Argument {
    return {
      symbol: parseAddress(payload.get(0)).toString(),
      amounts: parseTokenHolderMap(payload.get(2)),
      memo: parseMemo(payload.get(2), true),
    };
  }

  analyzeResponse() {
    return null;
  }
}
