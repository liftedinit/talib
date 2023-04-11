import type { FeatureAnalyzer } from "./index";

export class AccountFeatureMultisig implements FeatureAnalyzer {
  static id = 1;
  static featureName = "multisig";

  parseArgs(args: any[]): any {
    if (args.length == 0) {
      throw new Error("Not enough arguments.");
    }
    const m = args[0];
    if (!(m instanceof Map)) {
      throw new Error("Invalid argument.");
    }

    return {
      threshold: +m.get(0),
      timeoutInSecs: +m.get(1),
      executeAutomatically: !!m.get(2),
    };
  }
}
