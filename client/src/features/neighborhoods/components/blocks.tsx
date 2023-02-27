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
} from "@liftedinit/ui";
import { ErrorAlert } from "../../../shared";
import { getNeighborhoodBlocks } from "../queries";

interface BlockSummary {
  height: number;
  hash: string;
  numTxns: number;
  timestamp: Date;
}

export function NeighborhoodBlocks({ id }: { id: number }) {
  const query = useQuery(
    ["neighborhoods", id, "blocks"],
    getNeighborhoodBlocks(id)
  );

  return (
    <Box bg="white" p={6}>
      <Heading size="sm">Blocks</Heading>
      {query.isError && <ErrorAlert error={query.error as Error} />}
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
            {query.data?.map((block: BlockSummary) => (
              <Tr>
                <Td>{block.height}</Td>
                <Td>{block.hash}</Td>
                <Td>{block.numTxns}</Td>
                <Td>{block.timestamp.toLocaleString()}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
    </Box>
  );
}
