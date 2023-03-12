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
import { abbr, ago, by, ErrorAlert } from "..";

interface TxnSummary {
  hash: string;
  request: string;
  response: string;
  blockHash: string;
  blockHeight: number;
  blockIndex: number;
  dateTime: string;
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
                  <pre>{abbr(txn.hash)}</pre>
                </Td>
                <Td>
                  <Tag variant="outline" size="sm">
                    Unknown
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
