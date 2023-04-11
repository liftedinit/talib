import { Address } from "@liftedinit/many-js";
import { parseAddress } from "../../../cbor-parsers";
import { MethodAnalyzer } from "../../method-analyzer";

interface Argument {
  account: string;
}

type Result = null;

export class AccountDisable extends MethodAnalyzer<Argument, Result> {
  static method = "account.disable";
  static eventType = [9, 4];

  parseArgs(sender: Address, payload: Map<any, any>): Argument {
    const account = parseAddress(payload.get(0));

    return {
      account: account.toString(),
    };
  }

  async analyzeResponse(data: Buffer): Promise<Result> {
    return null;
  }
}
