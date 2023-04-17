import { Address } from "@liftedinit/many-js";
import { parseAddress } from "../../../cbor-parsers";
import { Analyzer } from "../../analyzer";

interface Argument {
  account: string;
  description: string;
}

type Result = null;

interface Event {
  account: string;
  description: string;
}

export class AccountSetDescription extends Analyzer<Argument, Result, Event> {
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

  analyzeEvent(payload: Map<any, any>): Event {
    return {
      account: parseAddress(payload.get(1)).toString(),
      description: payload.get(2).toString(),
    };
  }
}
