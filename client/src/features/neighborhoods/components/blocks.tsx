import { useQuery } from "react-query";
import {
  Spinner,
  Box,
  Table,
  Thead,
  Th,
  Tbody,
  Tr,
  Td,
  Heading,
  Flex,
  Spacer,
} from "@liftedinit/ui";
import { ErrorAlert } from "../../../shared";
import { getNeighborhoodBlocks } from "../queries";

interface BlockSummary {
  height: number;
  blockHash: string;
  txCount: number;
  timestamp: Date;
}

export function NeighborhoodBlocks({ id }: { id: number }) {
  const query = useQuery(
    ["neighborhoods", id, "blocks"],
    getNeighborhoodBlocks(id),
  );

  return (
    <Box bg="white" p={6}>
      <Flex>
        <Heading size="sm">Blocks</Heading>
        <Spacer />
        {query.isError && <ErrorAlert error={query.error as Error} />}
      </Flex>
      {query.isLoading ? (
        <Spinner />
      ) : (
        <Table>
          <Thead>
            <Th>Height</Th>
            <Th>Hash</Th>
            <Th>Txns</Th>
            <Th>Time</Th>
          </Thead>
          <Tbody>
            {query.data?.items &&
              query.data.items.map((block: BlockSummary) => (
                <Tr>
                  <Td>{block.height}</Td>
                  <Td>{block.blockHash}</Td>
                  <Td>{block.txCount}</Td>
                  <Td>{block.timestamp?.toLocaleString()}</Td>
                </Tr>
              ))}
          </Tbody>
        </Table>
      )}
    </Box>
  );
}
