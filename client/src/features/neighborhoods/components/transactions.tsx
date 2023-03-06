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
} from "@liftedinit/ui";
import { ErrorAlert } from "../../../shared";
import { getNeighborhoodTransactions } from "../queries";

interface TransactionSummary {
  hash: string;
  type: string;
  to?: string;
  from?: string;
  amount?: string;
  symbol?: string;
  timestamp: Date;
}

export function NeighborhoodTransactions({ id }: { id: number }) {
  const query = useQuery(
    ["neighborhoods", id, "transactions"],
    getNeighborhoodTransactions(id),
  );

  return (
    <Box bg="white" p={6}>
      <Flex mb={6}>
        <Heading size="sm">Transactions</Heading>
        <Spacer />
        {query.isError && <ErrorAlert error={query.error as Error} />}
      </Flex>
      {query.isLoading ? (
        <Spinner />
      ) : (
        <Table variant="simple" size="sm">
          <Thead>
            <Th>Hash</Th>
            <Th>Type</Th>
            <Th>Details</Th>
            <Th>Time</Th>
          </Thead>
          <Tbody>
            {query.data?.items &&
              query.data.items.map((transaction: TransactionSummary) => (
                <Tr>
                  <Td>{transaction.hash}</Td>
                  <Td>{transaction.type}</Td>
                  <Td>
                    {transaction.from}
                    {transaction.to}
                  </Td>
                  <Td>{transaction.timestamp?.toLocaleString()}</Td>
                </Tr>
              ))}
          </Tbody>
        </Table>
      )}
    </Box>
  );
}
