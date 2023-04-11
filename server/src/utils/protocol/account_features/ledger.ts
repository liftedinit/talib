import type { FeatureAnalyzer } from "./index";

export class AccountFeatureLedger implements FeatureAnalyzer {
  static id = 0;
  static featureName = "ledger";

  parseArgs(args: any[]): any {
    return null;
  }
}
