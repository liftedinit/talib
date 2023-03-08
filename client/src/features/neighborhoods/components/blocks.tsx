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
import { abbr, ago, ErrorAlert } from "../../../shared";
import { getNeighborhoodBlocks } from "../queries";

interface BlockSummary {
  height: number;
  blockHash: string;
  txCount: number;
  dateTime: string;
}

interface NeighborhoodBlocksProps {
  id: number;
  page?: number;
  limit?: number;
}

export function NeighborhoodBlocks({ id, page = 1 }: NeighborhoodBlocksProps) {
  const query = useQuery(
    ["neighborhoods", id, "blocks", page],
    getNeighborhoodBlocks(id, { page }),
  );

  return (
    <Box bg="white" my={6} p={6}>
      <Flex mb={6}>
        <Heading size="sm">Blocks</Heading>
        <Spacer />
        {query.isError && <ErrorAlert error={query.error as Error} />}
      </Flex>
      {query.isLoading ? (
        <Spinner />
      ) : (
        <Table size="sm">
          <Thead>
            <Th>Height</Th>
            <Th>Hash</Th>
            <Th>Txns</Th>
            <Th>Time</Th>
          </Thead>
          <Tbody>
            {query.data?.items &&
              query.data.items.map((block: BlockSummary) => (
                <Tr h={12}>
                  <Td>{block.height.toLocaleString()}</Td>
                  <Td>
                    <pre>{abbr(block.blockHash)}</pre>
                  </Td>
                  <Td>{block.txCount.toLocaleString()}</Td>
                  <Td>{ago(new Date(block.dateTime))}</Td>
                </Tr>
              ))}
          </Tbody>
        </Table>
      )}
    </Box>
  );
}
