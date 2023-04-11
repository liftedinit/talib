import { Address } from "@liftedinit/many-js";
import { parseAddress, parseMemo } from "../../../cbor-parsers";
import { MethodAnalyzer } from "../../method-analyzer";
import { parseTokenHolderMap, TokenHolderMapDto } from "../../tokens";

export interface LedgerMintTx {
  symbol: string;
  amounts: TokenHolderMapDto;
  memo?: string[];
}

export class LedgerMintAnalyzer extends MethodAnalyzer<LedgerMintTx, null> {
  static method = "ledger.mint";
  static eventType = [12, 0];

  parseArgs(sender: Address, payload: Map<any, any>): LedgerMintTx {
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
