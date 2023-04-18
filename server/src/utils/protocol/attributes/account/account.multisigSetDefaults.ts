import { Address } from "@liftedinit/many-js";
import { parseAddress } from "../../../cbor-parsers";
import { Analyzer } from "../../analyzer";

interface Argument {
  account: string;
  threshold?: number;
  timeoutInSecs?: number;
  executeAutomatically?: boolean;
}

type Result = null;

type Event = {
  sender: string;
  account: string;
  threshold?: number | null;
  timeoutInSecs?: number | null;
  executeAutomatically?: boolean | null;
};

export class AccountMultisigSetDefaults extends Analyzer<
  Argument,
  Result,
  Event
> {
  static method = "account.multisigSetDefaults";
  static eventType = [9, [1, 5]];

  parseArgs(sender: Address, payload: Map<any, any>): Argument {
    return {
      account: payload.get(0).toString(),
      ...(payload.has(1) && { threshold: +payload.get(1) }),
      ...(payload.has(2) && { timeoutInSecs: +payload.get(2) }),
      ...(payload.has(3) && { executeAutomatically: !!payload.get(3) }),
    };
  }

  async analyzeResponse(data: Buffer): Promise<Result> {
    return null;
  }

  analyzeEvent(payload: Map<any, any>): Event {
    return {
      sender: parseAddress(payload.get(1)).toString(),
      account: parseAddress(payload.get(2)).toString(),
      ...(payload.has(3) && { threshold: payload.get(3) }),
      ...(payload.has(4) && { timeoutInSecs: payload.get(4) }),
      ...(payload.has(5) && { executeAutomatically: payload.get(5) }),
    };
  }
}
