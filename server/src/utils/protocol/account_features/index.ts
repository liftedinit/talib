import { AccountFeatureLedger } from "./ledger";
import { AccountFeatureMultisig } from "./multisig";

interface FeatureClass {
  id: number;
  featureName: string;
  new (): FeatureAnalyzer;
}

const allFeatures: { [id: number]: FeatureClass } = [
  AccountFeatureLedger,
  AccountFeatureMultisig,
].reduce((acc, c) => {
  acc[c.id] = c;
  return acc;
}, {});

export interface FeatureAnalyzer {
  parseArgs(args: any[]): any;
}

export function parseFeatures(payload: any): Record<string, any> {
  if (!Array.isArray(payload)) {
    return {};
  }

  const features = {};
  for (const feature of payload) {
    if (!Array.isArray(feature)) {
      continue;
    }
    const [id, ...args] = feature;
    const maybeFeature = allFeatures[id];
    if (!maybeFeature) {
      throw new Error("Feature not implemented.");
    }

    const f = new maybeFeature();
    features[maybeFeature.featureName] = f.parseArgs(args);
  }

  return features;
}
