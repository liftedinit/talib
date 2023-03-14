import {
  Box,
  Center,
  Code,
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
import { abbr, ago, by } from "utils";

export const PrettyMethods: { [name: string]: string } = {
  "ledger.send": "Send",
  "account.multisigApprove": "Approve",
  "account.multisigRevoke": "Revoke",
  "account.multisigSubmitTransaction": "Submit",
  "idstore.store": "Register",
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
  return (
    <Box bg="white" my={6} p={6}>
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
        <Table size="sm">
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
                      <Code>{abbr(txn.hash)}</Code>
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
