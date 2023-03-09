import {
  Box,
  Center,
  Flex,
  Heading,
  Spacer,
  Spinner,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@liftedinit/ui";
import { Link } from "react-router-dom";
import { abbr, ago, ErrorAlert } from "..";

interface BlockSummary {
  height: number;
  blockHash: string;
  txCount: number;
  dateTime: string;
}

interface BlockListProps {
  blocks: BlockSummary[];
  error?: Error;
  isLoading?: boolean;
}

export function BlockList({
  blocks = [],
  error,
  isLoading = false,
}: BlockListProps) {
  return (
    <Box bg="white" my={6} p={6}>
      <Flex mb={6}>
        <Heading size="sm">Blocks</Heading>
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
            <Th>Height</Th>
            <Th>Hash</Th>
            <Th>Txns</Th>
            <Th>Time</Th>
          </Thead>
          <Tbody>
            {blocks.map((block) => (
              <Tr h={12}>
                <Td>
                  <Link to={`/blocks/${block.blockHash}`}>
                    {block.height.toLocaleString()}
                  </Link>
                </Td>
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
