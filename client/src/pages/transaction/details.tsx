import { Code, Tag, Text } from "@liftedinit/ui";
import { UseQueryResult } from "@tanstack/react-query";
import { PrettyMethods, TableObject } from "ui";
import {
  idStoreStore,
  useLedgerSend,
  multisigAction,
  multisigSubmit,
  useTokensMintBurn,
  tokensCreate,
  kvstorePut,
  kvstoreTransfer,
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
  "ledger.send": useLedgerSend,
  "tokens.burn": useTokensMintBurn,
  "tokens.mint": useTokensMintBurn,
  "tokens.create": tokensCreate,
  "kvstore.put": kvstorePut,
  "kvstore.transfer": kvstoreTransfer,
};

export function details(data: any) {
  const method = data.method || data._method;
  const detailFn = methodDetails[method];
  const prettyMethod = PrettyMethods[method] || "Unknown";

  let txn: TableObject = {
    Type: (
      <Text>
        <Tag variant="outline" size="sm">
          {prettyMethod}
        </Tag>{" "}
        (<Code>{method}</Code>)
      </Text>
    ),
  };

  if (detailFn) {
    txn = { ...txn, ...detailFn(data) };
  }

  if (data.argument && data.argument.memo) {
    txn = {
      ...txn,
      Memo: (
        <Text>
          {data.argument.memo.map((m: string) => (
          <>
            <Code marginTop={2}>{m}</Code>
            <br />
          </>
          ))}
        </Text>
      ),
    };
  }

  return txn;
}
