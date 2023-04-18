import { Address } from "@liftedinit/many-js";
import { parseAddress, parseError } from "../../../cbor-parsers";
import { Analyzer } from "../../analyzer";

interface Argument {
  account: string;
}

type Result = null;

type Event = {
  account: string;
  reason: { code: number; message: string; fields: { [name: string]: string } };
};

export class AccountDisable extends Analyzer<Argument, Result, Event> {
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

  analyzeEvent(payload: Map<any, any>): Event {
    return {
      account: parseAddress(payload.get(1)).toString(),
      ...(payload.has(2) && { reason: parseError(payload.get(2)) }),
    };
  }
}
