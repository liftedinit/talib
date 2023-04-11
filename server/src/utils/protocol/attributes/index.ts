import { MethodAnalyzerClass } from "../method-analyzer";
import { AccountAddRoles } from "./account.addRoles";
import { AccountCreate } from "./account.create";
import { AccountDisable } from "./account.disable";
import { AccountMultisigApprove } from "./account.multisigApprove";
import { AccountMultisigRevoke } from "./account.multisigRevoke";
import { AccountMultisigSetDefaults } from "./account.multisigSetDefaults";
import { AccountMultisigSubmitTransaction } from "./account.multisigSubmitTransaction";
import { AccountRemoveRoles } from "./account.removeRoles";
import { AccountSetDescription } from "./account.setDescription";
import { IdStoreStore } from "./idstore.store";
import { LedgerSendAnalyzer } from "./ledger.send";
import { TokensCreate } from "./tokens.create";

const transactionTypes: { [index: string]: MethodAnalyzerClass } = [
  AccountAddRoles,
  AccountCreate,
  AccountDisable,
  AccountMultisigApprove,
  AccountMultisigRevoke,
  AccountMultisigSetDefaults,
  AccountMultisigSubmitTransaction,
  AccountRemoveRoles,
  AccountSetDescription,
  IdStoreStore,
  LedgerSendAnalyzer,
  TokensCreate,
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
