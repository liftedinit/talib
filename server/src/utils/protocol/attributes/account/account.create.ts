import { Address } from "@liftedinit/many-js";
import * as cbor from "cbor";
import { parseAddress, parseRoles } from "../../../cbor-parsers";
import { Analyzer, tags } from "../../analyzer";
import { parseFeatures } from "./features";

type Argument = {
  description?: string;
  roles?: { [address: string]: string[] };
  features: { [name: string]: any };
};

type Result = {
  account: string;
};

type Event = {
  account: string;
  description?: string;
  roles?: { [address: string]: string[] };
  features: { [name: string]: any };
};

export class AccountCreate extends Analyzer<Argument, Result, Event> {
  static method = "account.create";
  static eventType = [9, 0];

  parseArgs(sender: Address, payload: Map<any, any>): Argument {
    return {
      ...(payload.has(0) && { description: payload.get(0).toString() }),
      ...(payload.has(1) && { roles: parseRoles(payload.get(1)) }),
      features: parseFeatures(payload.get(2)),
    };
  }

  async analyzeResponse(data: Buffer): Promise<Result> {
    const payload = await cbor.decodeFirst(data, { tags });

    return {
      account: payload.get(0).toString(),
    };
  }

  analyzeEvent(payload: Map<any, any>): Event {
    return {
      account: parseAddress(payload.get(1)).toString(),
      ...(payload.has(0) && { description: payload.get(2).toString() }),
      roles: parseRoles(payload.get(3)),
      features: parseFeatures(payload.get(4)),
    };
  }
}
