import { Address } from "@liftedinit/many-js";
import * as cbor from "cbor";
import { parseAddress, parseMemo } from "../../../utils/cbor-parsers";
import { bufferToHex } from "../../../utils/convert";
import { MethodAnalyzer, tags } from "../method-analyzer";
import { getMethodAnalyzerClass } from "./index";

export interface AccountMultisigSubmitTransactionTx {
  account: string;
  transaction: string | Record<string, any>;
  overrides: {
    nbApprovers?: number;
    timeout?: number;
    automaticExecution?: boolean;
  };
  memo: string[];
}

export interface AccountMultisigSubmitTransactionResult {
  token: string;
}

export class AccountMultisigSubmitTransaction extends MethodAnalyzer<
  AccountMultisigSubmitTransactionTx,
  AccountMultisigSubmitTransactionResult
> {
  static method = "account.multisigSubmitTransaction";
  static eventType = [9, [1, 0]];

  parseArgs(
    sender: Address,
    payload: Map<any, any>,
  ): AccountMultisigSubmitTransactionTx {
    const account = parseAddress(payload.get(0));
    return {
      account: account.toString(),
      transaction: this.parseTransaction(account, payload.get(2)),
      overrides: {
        ...(payload.has(3) && { nbApprovers: +payload.get(3) }),
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
    const maybeTxClass = getMethodAnalyzerClass(undefined, txType);

    if (!maybeTxClass) {
      return `Unknown tx type ${txType}`;
    }

    const impl = new maybeTxClass();
    const innerPayload = payload.get(1);
    return {
      _method: maybeTxClass.method,
      ...impl.parseArgs(sender, innerPayload),
    };
  }

  async analyzeResponse(
    data: Buffer,
  ): Promise<AccountMultisigSubmitTransactionResult> {
    const payload = await cbor.decodeFirst(data, { tags });

    return {
      token: bufferToHex(payload.get(0)),
    };
  }
}
