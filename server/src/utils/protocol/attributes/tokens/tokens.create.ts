import { Address } from "@liftedinit/many-js";
import * as cbor from "cbor";
import { parseAddress, parseMemo } from "../../../cbor-parsers";
import { Analyzer, tags } from "../../analyzer";
import {
  parseTokenHolderMap,
  parseTokenInfo,
  parseTokenInfoSummary,
  TokenHolderMapDto,
  TokenInfoDto,
  TokenInfoSummaryDto,
} from "../../tokens";

type ArgumentT = {
  summary: TokenInfoSummaryDto;
  owner: string;
  holders: TokenHolderMapDto;
  maximumSupply?: string;
  extendedInfo: any;
  memo: string[];
};

type ResultT = {
  info: TokenInfoDto;
};

type EventT = {
  symbol: string;
  amounts: TokenHolderMapDto;
  memo: string[];
};

export class TokensCreate extends Analyzer<ArgumentT, ResultT, EventT> {
  static method = "tokens.create";
  static eventType = [11, 0];

  parseArgs(sender: Address, payload: Map<any, any>) {
    return {
      summary: parseTokenInfoSummary(payload.get(0)),
      owner: (parseAddress(payload.get(1), true) || sender).toString(),
      holders: parseTokenHolderMap(payload.get(2) || {}),
      extendedInfo: {},
      memo: parseMemo(payload.get(5), true) || [],
    };
  }

  async analyzeResponse(data: Buffer) {
    const payload = await cbor.decodeFirst(data, { tags });

    return {
      info: parseTokenInfo(payload.get(0)),
    };
  }

  analyzeEvent(payload: Map<any, any>) {
    return {
      symbol: parseAddress(payload.get(1)).toString(),
      amounts: parseTokenHolderMap(payload.get(2)),
      memo: parseMemo(payload.get(3)),
    };
  }
}
