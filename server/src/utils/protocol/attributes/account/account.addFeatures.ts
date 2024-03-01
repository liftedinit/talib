import { Address } from "@liftedinit/many-js";
import { parseAddress, parseRoles } from "../../../cbor-parsers";
import { parseFeatures } from "./features"
import { Analyzer } from "../../analyzer";

interface Argument {
  account: string;
  roles?: { [address: string]: string[] };
  features: { [name: string]: any };
}

type Result = null;

type Event = {
  account: string;
  roles?: { [address: string]: string[] };
  features: { [name: string]: any };
};

export class AccountAddFeatures extends Analyzer<Argument, Result, Event> {
  static method = "account.addFeatures";
  static eventType = [9, 5];

  parseArgs(sender: Address, payload: Map<any, any>): Argument {
    console.log(`Parsing account.addFeatures payload: ${JSON.stringify(payload)}`)
    const account = parseAddress(payload.get(0));

    return {
      account: account.toString(),
      ...(payload.has(1) && { roles: parseRoles(payload.get(1)) }),
      features: parseFeatures(payload.get(2)),
    };
  }

  async analyzeResponse(data: Buffer): Promise<Result> {
    return null;
  }

  analyzeEvent(payload: Map<any, any>): Event {
    return {
      account: parseAddress(payload.get(1)).toString(),
      roles: parseRoles(payload.get(2)),
      features: parseFeatures(payload.get(3)),
    };
  }
}
