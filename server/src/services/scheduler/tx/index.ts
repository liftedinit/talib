import { MethodAnalyzerClass } from "../method-analyzer";
import { AccountAddRoles } from "./account.addRoles";
import { AccountMultisigApprove } from "./account.multisigApprove";
import { AccountMultisigRevoke } from "./account.multisigRevoke";
import { AccountMultisigSubmitTransaction } from "./account.multisigSubmitTransaction";
import { AccountRemoveRoles } from "./account.removeRoles";
import { IdStoreStore } from "./idstore.store";
import { LedgerSendAnalyzer } from "./ledger.send";

const transactionTypes: MethodAnalyzerClass[] = [
  LedgerSendAnalyzer,
  IdStoreStore,
  AccountAddRoles,
  AccountRemoveRoles,
  AccountMultisigSubmitTransaction,
  AccountMultisigApprove,
  AccountMultisigRevoke,
];

export function getMethodAnalyzerClass(
  method?: string,
  eventType?: any,
): null | MethodAnalyzerClass {
  if (method) {
    for (const maybeClass of transactionTypes) {
      if (maybeClass.method == method) {
        return maybeClass;
      }
    }
  } else if (eventType) {
    eventType = JSON.stringify(eventType);
    for (const maybeClass of transactionTypes) {
      if (JSON.stringify(maybeClass.eventType) == eventType) {
        return maybeClass;
      }
    }
  }
  return null;
}
