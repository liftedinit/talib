import { Address } from "@liftedinit/many-js";
import * as cbor from "cbor";
import { parseAddress, parseMemo } from "../../cbor-parsers";
import { MethodAnalyzer, tags } from "../method-analyzer";
import {
  parseTokenHolderMap,
  parseTokenInfo,
  parseTokenInfoSummary,
  TokenHolderMapDto,
  TokenInfoDto,
  TokenInfoSummaryDto,
} from "../tokens";

type Argument = {
  summary: TokenInfoSummaryDto;
  owner: string;
  holders: TokenHolderMapDto;
  maximumSupply?: string;
  extendedInfo: any;
  memo: string[];
};

type Result = {
  info: TokenInfoDto;
};

export class TokensCreate extends MethodAnalyzer<Argument, Result> {
  static method = "tokens.create";
  static eventType = [11, 0];

  parseArgs(sender: Address, payload: Map<any, any>): Argument {
    return {
      summary: parseTokenInfoSummary(payload.get(0)),
      owner: (parseAddress(payload.get(1), true) || sender).toString(),
      holders: parseTokenHolderMap(payload.get(2) || {}),
      extendedInfo: {},
      memo: parseMemo(payload.get(5), true) || [],
    };
  }

  async analyzeResponse(data: Buffer): Promise<Result> {
    const payload = await cbor.decodeFirst(data, { tags });

    return {
      info: parseTokenInfo(payload.get(0)),
    };
  }
}
