import { MethodAnalyzerClass } from "../analyzer";
import * as account from "./account";
import * as idstore from "./idstore";
import * as ledger from "./ledger";
import * as kvstore from "./kvstore";
import * as tokens from "./tokens";

const transactionTypes: { [index: string]: MethodAnalyzerClass } = [
  ...Object.values(account),
  ...Object.values(idstore),
  ...Object.values(ledger),
  ...Object.values(tokens),
  ...Object.values(kvstore),
].reduce((acc, c: MethodAnalyzerClass) => {
  acc[c.method] = c;
  acc[JSON.stringify(c.eventType)] = c;
  return acc;
}, {});

export function getAnalyzerClass(
  method?: string,
  eventType?: any,
): null | MethodAnalyzerClass {
  if (method) {
    return transactionTypes[method] || null;
  } else if (eventType) {
    eventType = JSON.stringify(eventType);
    return transactionTypes[eventType] || null;
  }
  return null;
}
