import { Code, Tag, Text } from "@liftedinit/ui";
import { UseQueryResult } from "@tanstack/react-query";
import { PrettyMethods, TableObject } from "ui";
import {
  idStoreStore,
  ledgerSend,
  multisigAction,
  multisigSubmit,
  tokensMintBurn,
} from ".";

const methodDetails: {
  [method: string]: (data: UseQueryResult) => TableObject;
} = {
  "account.multisigSubmitTransaction": multisigSubmit,
  "account.multisigApprove": multisigAction,
  "account.multisigRevoke": multisigAction,
  "account.multisigExecute": multisigAction,
  "account.multisigWithdraw": multisigAction,
  "idstore.store": idStoreStore,
  "ledger.send": ledgerSend,
  "tokens.burn": tokensMintBurn,
  "tokens.mint": tokensMintBurn,
};

export function details(data: any) {
  const detailFn = methodDetails[data.method];
  const prettyMethod = PrettyMethods[data.method] || "Unknown";

  let txn: TableObject = {
    Type: (
      <Text>
        <Tag variant="outline" size="sm">
          {prettyMethod}
        </Tag>{" "}
        (<Code>{data.method}</Code>)
      </Text>
    ),
  };

  if (detailFn) {
    txn = { ...txn, ...detailFn(data) };
  }

  return txn;
}
