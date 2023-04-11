import { Address } from "@liftedinit/many-js";
import { ManyError } from "@liftedinit/many-js/dist/message/error";
import * as cbor from "cbor";

export type MethodAnalyzerClass = {
  method: string;
  eventType?: (number | number[] | number[][])[];

  new (): MethodAnalyzer<any, any>;
};

export abstract class MethodAnalyzer<ArgumentT, ResponseT> {
  abstract parseArgs(sender: Address, payload: Map<any, any>): ArgumentT;

  async analyzeRequest(sender: Address, data: Buffer): Promise<ArgumentT> {
    const payload = await cbor.decodeFirst(data, { tags });
    return this.parseArgs(sender, payload);
  }

  abstract analyzeResponse(data: Buffer): Promise<ResponseT>;

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
      ..._getAllAddressesOf(request),
      ..._getAllAddressesOf(response),
      ..._getAllAddressesOf(error),
    ];
  }
}

export const tags = {
  10000: (value: Uint8Array) => new Address(Buffer.from(value)),
};

function _getAllAddressesOf(v: any): Address[] {
  if (typeof v == "string") {
    try {
      return [Address.fromString(v)];
    } catch (_) {}
  }

  if (typeof v != "object" || v === null) {
    return [];
  }
  if (Array.isArray(v)) {
    return v.reduce((acc, item) => [...acc, ..._getAllAddressesOf(item)], []);
  } else if (v instanceof Address) {
    return [v];
  }

  return Object.getOwnPropertyNames(v).reduce((acc, key) => {
    return [...acc, ..._getAllAddressesOf(v[key])];
  }, []);
}
