import { Address } from "@liftedinit/many-js";
import { MethodAnalyzer } from "../method-analyzer";

interface Argument {
  account: string;
  threshold?: number;
  timeoutInSecs?: number;
  executeAutomatically?: boolean;
}

type Result = null;

export class AccountMultisigSetDefaults extends MethodAnalyzer<
  Argument,
  Result
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
}
