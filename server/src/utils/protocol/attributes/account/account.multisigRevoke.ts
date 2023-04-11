import { Address } from "@liftedinit/many-js";
import { parseBuffer } from "../../../cbor-parsers";
import { bufferToHex } from "../../../convert";
import { MethodAnalyzer } from "../../method-analyzer";

export interface AccountMultisigRevokeTx {
  token: string;
}

export type AccountMultisigRevokeResult = null;

export class AccountMultisigRevoke extends MethodAnalyzer<
  AccountMultisigRevokeTx,
  AccountMultisigRevokeResult
> {
  static method = "account.multisigRevoke";
  static eventType = [9, [1, 2]];

  parseArgs(sender: Address, payload: Map<any, any>): AccountMultisigRevokeTx {
    return {
      token: bufferToHex(parseBuffer(payload.get(0))),
    };
  }

  async analyzeResponse(data: Buffer): Promise<AccountMultisigRevokeResult> {
    return null;
  }
}
