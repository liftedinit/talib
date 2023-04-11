import { Address } from "@liftedinit/many-js";
import { parseBuffer } from "../../cbor-parsers";
import { bufferToHex } from "../../convert";
import { MethodAnalyzer } from "../method-analyzer";

interface Argument {
  token: string;
}

type Result = null;

export class AccountMultisigApprove extends MethodAnalyzer<Argument, Result> {
  static method = "account.multisigApprove";
  static eventType = [9, [1, 1]];

  parseArgs(sender: Address, payload: Map<any, any>): Argument {
    return {
      token: bufferToHex(parseBuffer(payload.get(0))),
    };
  }

  async analyzeResponse(data: Buffer): Promise<Result> {
    return null;
  }
}
