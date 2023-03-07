import { useQuery } from "react-query";
import {
  Spinner,
  Box,
  Table,
  Tr,
  Td,
  Thead,
  Th,
  Tbody,
  Heading,
  Flex,
  Spacer,
  Tag,
} from "@liftedinit/ui";
import { abbr, ago, by, ErrorAlert } from "../../../shared";
import { getNeighborhoodTransactions } from "../queries";

interface TransactionSummary {
  hash: string;
  request: string;
  response: string;
  blockHash: string;
  blockHeight: number;
  blockIndex: number;
  dateTime: string;
}

export function NeighborhoodTransactions({ id }: { id: number }) {
  const query = useQuery(
    ["neighborhoods", id, "transactions"],
    getNeighborhoodTransactions(id),
  );

  return (
    <Box bg="white" my={6} p={6}>
      <Flex mb={6}>
        <Heading size="sm">Transactions</Heading>
        <Spacer />
        {query.isError && <ErrorAlert error={query.error as Error} />}
      </Flex>
      {query.isLoading ? (
        <Spinner />
      ) : (
        <Table size="sm">
          <Thead>
            <Th>Hash</Th>
            <Th>Type</Th>
            <Th>Height</Th>
            <Th>Time</Th>
          </Thead>
          <Tbody>
            {query.data?.items &&
              query.data.items
                .sort(by("blockHeight"))
                .map((transaction: TransactionSummary) => (
                  <Tr h={12}>
                    <Td>
                      <pre>{abbr(transaction.hash)}</pre>
                    </Td>
                    <Td>
                      <Tag variant="outline" size="sm">
                        Unknown
                      </Tag>
                    </Td>
                    <Td>{transaction.blockHeight.toLocaleString()}</Td>
                    <Td>{ago(new Date(transaction.dateTime))}</Td>
                  </Tr>
                ))}
          </Tbody>
        </Table>
      )}
    </Box>
  );
}
