import { Address } from "@liftedinit/many-js";
import { parseAddress, parseMemo } from "../../../cbor-parsers";
import { Analyzer } from "../../analyzer";
import { parseTokenHolderMap, TokenHolderMapDto } from "../../tokens";

interface ArgumentT {
  symbol: string;
  amounts: TokenHolderMapDto;
  memo?: string[];
}

type ResultT = null;

interface EventT {
  symbol: string;
  amounts: { [address: string]: string };
  memo?: string[];
}

export class TokensBurnAnalyzer extends Analyzer<ArgumentT, ResultT, EventT> {
  static method = "tokens.burn";
  static eventType = [12, 1];

  parseArgs(sender: Address, payload: Map<any, any>) {
    return {
      symbol: parseAddress(payload.get(0)).toString(),
      amounts: parseTokenHolderMap(payload.get(2)),
      memo: parseMemo(payload.get(2), true),
    };
  }

  analyzeResponse() {
    return null;
  }

  analyzeEvent(payload: Map<any, any>): EventT {
    return {
      symbol: parseAddress(payload.get(1)).toString(),
      amounts: parseTokenHolderMap(payload.get(2)),
      memo: parseMemo(payload.get(3), true),
    };
  }
}
