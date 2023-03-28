import { Address } from "@liftedinit/many-js";
import * as cbor from "cbor";
import {
  MethodAnalyzer,
  parseAddress,
  parseMemo,
  tags,
} from "../tx-analyzer.service";

export interface LedgerSendTx {
  from: string;
  to: string;
  amount: number;
  symbol: string;
  memo?: string[];
}

export class LedgerSendAnalyzer extends MethodAnalyzer<LedgerSendTx, null> {
  constructor() {
    super();
  }

  async analyzeRequest(sender: Address, data: Buffer): Promise<LedgerSendTx> {
    const payload = await cbor.decodeFirst(data, { tags });
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
