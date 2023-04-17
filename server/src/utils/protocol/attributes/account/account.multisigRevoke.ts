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
  approver: string;
};

export class AccountMultisigRevoke extends Analyzer<Argument, Result, Event> {
  static method = "account.multisigRevoke";
  static eventType = [9, [1, 2]];

  parseArgs(sender: Address, payload: Map<any, any>) {
    return {
      token: bufferToHex(parseBuffer(payload.get(0))),
    };
  }

  async analyzeResponse(data: Buffer) {
    return null;
  }

  analyzeEvent(payload: Map<any, any>) {
    return {
      account: parseAddress(payload.get(1)).toString(),
      token: bufferToHex(parseBuffer(payload.get(2))),
      approver: parseAddress(payload.get(3)).toString(),
    };
  }
}
