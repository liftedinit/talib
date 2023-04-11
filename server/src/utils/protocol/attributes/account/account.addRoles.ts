import { Address } from "@liftedinit/many-js";
import { parseAddress, parseRoles } from "../../../cbor-parsers";
import { MethodAnalyzer } from "../../method-analyzer";

interface Argument {
  account: string;
  roles: { [address: string]: string[] };
}

type Result = null;

export class AccountAddRoles extends MethodAnalyzer<Argument, Result> {
  static method = "account.addRoles";
  static eventType = [9, 2];

  parseArgs(sender: Address, payload: Map<any, any>): Argument {
    const account = parseAddress(payload.get(0));
    const roleMap = payload.get(1);

    return {
      account: account.toString(),
      roles: parseRoles(roleMap),
    };
  }

  async analyzeResponse(data: Buffer): Promise<Result> {
    return null;
  }
}
