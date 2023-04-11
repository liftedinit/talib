import { MethodAnalyzerClass } from "../method-analyzer";
import * as account from "./account";
import * as idstore from "./idstore";
import * as ledger from "./ledger";
import * as tokens from "./tokens";

const transactionTypes: { [index: string]: MethodAnalyzerClass } = [
  account.AccountAddRoles,
  account.AccountCreate,
  account.AccountDisable,
  account.AccountMultisigApprove,
  account.AccountMultisigRevoke,
  account.AccountMultisigSetDefaults,
  account.AccountMultisigSubmitTransaction,
  account.AccountRemoveRoles,
  account.AccountSetDescription,
  idstore.IdStoreStore,
  ledger.LedgerBurnAnalyzer,
  ledger.LedgerMintAnalyzer,
  ledger.LedgerSendAnalyzer,
  tokens.TokensCreate,
].reduce((acc, c: MethodAnalyzerClass) => {
  acc[c.method] = c;
  acc[JSON.stringify(c.eventType)] = c;
  return acc;
}, {});

export function getMethodAnalyzerClass(
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
