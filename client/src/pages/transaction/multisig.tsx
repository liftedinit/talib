import { Code } from "@liftedinit/ui";
import { ObjectTable, TableObject } from "ui";
import { details } from ".";

export function multisigSubmit(data: any) {
  const txn: TableObject = details(data.argument.transaction);
  return {
    Transaction: <ObjectTable obj={txn} />,
    "Transaction Token": <Code>{data.result.token}</Code>,
  };
}

export function multisigAction(data: any) {
  return {
    "Transaction Token": <Code>{data.argument.token}</Code>,
  };
}
