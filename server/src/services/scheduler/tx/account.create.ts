import { Address } from "@liftedinit/many-js";
import * as cbor from "cbor";
import { parseRoles } from "../../../utils/cbor-parsers";
import { MethodAnalyzer, tags } from "../method-analyzer";

type Argument = {
  name?: string;
  roles?: { [address: string]: string[] };
  features: any;
};

type Result = {
  account: string;
};

export class AccountCreate extends MethodAnalyzer<Argument, Result> {
  static method = "account.create";
  static eventType = [9, 0];

  parseArgs(sender: Address, payload: Map<any, any>): Argument {
    return {
      ...(payload.has(0) && { name: payload.get(0).toString() }),
      ...(payload.has(1) && { roles: parseRoles(payload.get(1)) }),
      features: JSON.parse(JSON.stringify(payload.get(2))),
    };
  }

  async analyzeResponse(data: Buffer): Promise<Result> {
    const payload = await cbor.decodeFirst(data, { tags });

    return {
      account: payload.get(0).toString(),
    };
  }
}
