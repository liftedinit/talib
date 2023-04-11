import { Address } from "@liftedinit/many-js";
import { parseAddress } from "../../../cbor-parsers";
import { MethodAnalyzer } from "../../method-analyzer";

interface Argument {
  account: string;
  description: string;
}

type Result = null;

export class AccountSetDescription extends MethodAnalyzer<Argument, Result> {
  static method = "account.setDescription";
  static eventType = [9, 1];

  parseArgs(sender: Address, payload: Map<any, any>): Argument {
    const account = parseAddress(payload.get(0));
    const description = payload.get(1).toString();

    return {
      account: account.toString(),
      description,
    };
  }

  async analyzeResponse(data: Buffer): Promise<Result> {
    return null;
  }
}
