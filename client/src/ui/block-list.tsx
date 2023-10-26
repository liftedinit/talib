import {
  Box,
  Center,
  Code,
  Flex,
  Heading,
  Spacer,
  Spinner,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@liftedinit/ui";
import { Link } from "react-router-dom";

import { ErrorAlert } from "ui";
import { abbr, ago, useBgColor } from "utils";

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

  const bg = useBgColor();

  return (
    <Box my={6} p={6} bg={bg}>
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
                    <Text m={0} color="brand.teal.500">
                      {block.height.toLocaleString()}
                    </Text>
                  </Link>
                </Td>
                <Td>
                  <Code colorScheme="gray">{abbr(block.blockHash)}</Code>
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
