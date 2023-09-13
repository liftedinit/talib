import { Address } from "@liftedinit/many-js";
import { ManyError } from "@liftedinit/many-js/dist/message/error";
import * as cbor from "cbor";
import { getAllAddressesOf } from "../cbor-parsers";

export type MethodAnalyzerClass = {
  method: string;
  eventType?: (number | number[] | number[][])[];

  new (): Analyzer<any, any, any>;
};

export abstract class Analyzer<ArgumentT, ResponseT, EventT> {
  abstract parseArgs(sender: Address, payload: Map<any, any>): ArgumentT;

  async analyzeRequest(sender: Address, data: Buffer): Promise<ArgumentT> {
    const payload = await cbor.decodeFirst(data, { tags });
    return this.parseArgs(sender, payload);
  }

  abstract analyzeResponse(data: Buffer): Promise<ResponseT>;

  abstract analyzeEvent(payload: Map<any, any>): EventT;

  // Return addresses related to a transaction. This will be compounded in a
  // set of address string representations, but this method should only return
  // Addresses without worrying about distinctiveness.
  // By default, will just navigate a JS object at runtime and check if any
  // properties are addresses or address strings.
  async addresses(
    request: ArgumentT,
    response: ResponseT | null,
    error: ManyError | null,
  ): Promise<Address[]> {
    return [
      ...getAllAddressesOf(request),
      ...getAllAddressesOf(response),
      ...getAllAddressesOf(error),
    ];
  }
}

const parseAddressTag = (value: any) => {
  if (value instanceof Uint8Array) {
    return new Address(Buffer.from(value));
  } else if (typeof value === "string") {
    return Address.fromString(value);
  }
};

export const tags = {
  10000: parseAddressTag,
};
