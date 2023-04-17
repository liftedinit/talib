import { Address } from "@liftedinit/many-js";
import { parseAddress, parseBuffer } from "../../../cbor-parsers";
import { bufferToHex } from "../../../convert";
import { Analyzer } from "../../analyzer";

interface Argument {
  token: string;
}

type Result = null;

type Event = {
  account: string;
  token: string;
  executer?: string;
  response: any;
};

export class AccountMultisigExecute extends Analyzer<Argument, Result, Event> {
  static method = "account.multisigExecute";
  static eventType = [9, [1, 3]];

  parseArgs(sender: Address, payload: Map<any, any>): Argument {
    return {
      token: bufferToHex(parseBuffer(payload.get(0))),
    };
  }

  async analyzeResponse(data: Buffer): Promise<Result> {
    return null;
  }

  analyzeEvent(payload: Map<any, any>): Event {
    return {
      account: parseAddress(payload.get(1)).toString(),
      token: bufferToHex(parseBuffer(payload.get(2))),
      executer: parseAddress(payload.get(3), true)?.toString(),
      response: payload.get(4),
    };
  }
}
