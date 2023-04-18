import { Address } from "@liftedinit/many-js";
import { parseAddress, parseRoles } from "../../../cbor-parsers";
import { Analyzer } from "../../analyzer";

interface Argument {
  account: string;
  roles: { [address: string]: string[] };
}

type Result = null;

type Event = {
  account: string;
  roles: { [address: string]: string[] };
};

export class AccountAddRoles extends Analyzer<Argument, Result, Event> {
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

  analyzeEvent(payload: Map<any, any>): Event {
    return {
      account: parseAddress(payload.get(1)).toString(),
      roles: parseRoles(payload.get(2)),
    };
  }
}
