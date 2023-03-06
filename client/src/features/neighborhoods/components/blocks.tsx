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
  dateTime: string;
}

function abbr(hash: string) {
  return hash.slice(0, 4) + "..." + hash.slice(-4);
}

export function NeighborhoodBlocks({ id }: { id: number }) {
  const query = useQuery(
    ["neighborhoods", id, "blocks"],
    getNeighborhoodBlocks(id),
  );

  return (
    <Box bg="white" p={6}>
      <Flex mb={6}>
        <Heading size="sm">Blocks</Heading>
        <Spacer />
        {query.isError && <ErrorAlert error={query.error as Error} />}
      </Flex>
      {query.isLoading ? (
        <Spinner />
      ) : (
        <Table variant="simple" size="sm">
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
                  <Td>{block.height.toLocaleString()}</Td>
                  <Td>
                    <pre>{abbr(block.blockHash)}</pre>
                  </Td>
                  <Td>{block.txCount.toLocaleString()}</Td>
                  <Td>{new Date(block.dateTime).toLocaleString()}</Td>
                </Tr>
              ))}
          </Tbody>
        </Table>
      )}
    </Box>
  );
}
