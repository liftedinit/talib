import { Address } from "@liftedinit/many-js";
import * as cbor from "cbor";
import { parseAddress, parseDateTime, parseMemo } from "../../../cbor-parsers";
import { bufferToHex } from "../../../convert";
import { Analyzer, tags } from "../../analyzer";
import { getAnalyzerClass } from "../index";

export interface Argument {
  account: string;
  transaction: string | Record<string, any>;
  overrides: {
    threshold?: number;
    timeout?: number;
    automaticExecution?: boolean;
  };
  memo: string[];
}

export interface Result {
  token: string;
}

export type Event = {
  sender: string;
  account: string;
  transaction: any;
  token: string;
  threshold: number;
  expiresAt: string;
  automaticExecution: boolean;
  memo?: string[];
};

export class AccountMultisigSubmitTransaction extends Analyzer<
  Argument,
  Result,
  Event
> {
  static method = "account.multisigSubmitTransaction";
  static eventType = [9, [1, 0]];

  parseArgs(sender: Address, payload: Map<any, any>) {
    const account = parseAddress(payload.get(0));
    return {
      account: account.toString(),
      transaction: this.parseTransaction(account, payload.get(2)),
      overrides: {
        ...(payload.has(3) && { threshold: +payload.get(3) }),
        ...(payload.has(4) && { timeout: +payload.get(4) }),
        ...(payload.has(5) && { automaticExecution: !!payload.get(5) }),
      },
      memo: parseMemo(payload.get(7), true),
    };
  }

  parseTransaction(
    sender: Address,
    payload: Map<any, any>,
  ): string | Record<string, any> {
    const txType = payload.get(0);
    const maybeTxClass = getAnalyzerClass(undefined, txType);

    if (!maybeTxClass) {
      return `Unknown tx type ${txType}`;
    }

    const impl = new maybeTxClass();
    const innerPayload = payload.get(1);
    return {
      method: maybeTxClass.method,
      argument: impl.parseArgs(sender, innerPayload),
    };
  }

  async analyzeResponse(data: Buffer): Promise<Result> {
    const payload = await cbor.decodeFirst(data, { tags });

    return {
      token: bufferToHex(payload.get(0)),
    };
  }

  analyzeEvent(payload: Map<any, any>): Event {
    const sender = parseAddress(payload.get(1));
    const transaction = this.parseTransaction(sender, payload.get(4));

    return {
      sender: sender.toString(),
      account: parseAddress(payload.get(2)).toString(),
      transaction,
      token: bufferToHex(payload.get(5)),
      threshold: +payload.get(6),
      expiresAt: parseDateTime(payload.get(7)).toISOString(),
      automaticExecution: !!payload.get(8),
      memo: parseMemo(payload.get(10), true),
    };
  }
}
