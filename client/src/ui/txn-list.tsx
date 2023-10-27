import {
  Box,
  Center,
  Flex,
  Heading,
  Spacer,
  Spinner,
  Table,
  Tag,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@liftedinit/ui";
import { Link } from "react-router-dom";

import { ErrorAlert } from "ui";
import { abbr, ago, by, useBgColor } from "utils";

export const PrettyMethods: { [name: string]: string } = {
  "account.addRoles": "Add",
  "account.create": "Create",
  "account.multisigSubmitTransaction": "Submit",
  "account.multisigApprove": "Approve",
  "account.multisigRevoke": "Revoke",
  "account.multisigExecute": "Execute",
  "account.multisigWithdraw": "Withdraw",
  "account.multisigSetDefaults": "Set",
  "account.removeRoles": "Remove",
  "idstore.store": "Register",
  "ledger.send": "Send",
  "tokens.burn": "Burn",
  "tokens.mint": "Mint",
  "tokens.create": "Create",
  "kvstore.put": "Put",
  "kvstore.transfer": "Transfer",
};

interface TxnSummary {
  hash: string;
  blockHash: string;
  blockHeight: number;
  blockIndex: number;
  dateTime: string;
  method?: string;
}

interface TransactionListProps {
  txns: TxnSummary[];
  error?: Error;
  isLoading?: boolean;
}

export function TransactionList({
  txns = [],
  error,
  isLoading = false,
}: TransactionListProps) {
  const bg = useBgColor();

  return (
    <Box my={6} p={6} bg={bg}>
      <Flex mb={6}>
        <Heading size="sm">Transactions</Heading>
        <Spacer />
        {error && <ErrorAlert error={error} />}
      </Flex>
      {isLoading ? (
        <Center>
          <Spinner />
        </Center>
      ) : (
        <Table size="sm" className="talib-table">
          <Thead>
            <Th>Hash</Th>
            <Th>Type</Th>
            <Th>Height</Th>
            <Th>Time</Th>
          </Thead>
          <Tbody>
            {txns.sort(by("blockHeight")).map((txn) => (
              <Tr h={12}>
                <Td>
                  <Link to={`/transactions/${txn.hash}`}>
                    <Text color="brand.teal.500">
                      <pre>{abbr(txn.hash)}</pre>
                    </Text>
                  </Link>
                </Td>
                <Td>
                  <Tag variant="outline" size="sm">
                    {(txn.method && PrettyMethods[txn.method]) ?? "Unknown"}
                  </Tag>
                </Td>
                <Td>
                  <Link to={`/blocks/${txn.blockHash}`}>
                    <Text color="brand.teal.500">
                      {txn.blockHeight.toLocaleString()}
                    </Text>
                  </Link>
                </Td>
                <Td>{ago(new Date(txn.dateTime))}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
    </Box>
  );
}
