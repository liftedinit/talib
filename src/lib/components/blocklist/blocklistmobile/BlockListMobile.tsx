// Recommended for icons
import { Box, Stack, Text, Table, Tr, Td } from "@chakra-ui/react";
import React from "react";

import { NoContent } from "lib/components/customtable/components/NoContent";
import { Pagination } from "lib/components/customtable/components/Pagination";
import { usePagination } from "lib/components/customtable/hooks/usePagination";
import { theme } from "lib/styles/customTheme";

type Block = {
  id: number;
  block_hash: string;
  time: string;
  num_of_txs: number;
  data_size: number;
  nodes: number;
};

interface Props {
  blocks: Block[];
}

const BlockListMobile = ({ blocks }: Props) => {
  // Control current Page
  const [page, setPage] = React.useState(1);
  const totalRegisters = blocks.length;

  const pagination = usePagination({
    totalRegisters,
    page,
    items: blocks,
  });

  if (blocks.length === 0) {
    return <NoContent text="No information to show." />;
  }

  return (
    <Box>
      {blocks.map((block, index) => (
        <Stack>
          <Table
            key={block.id}
            variant="unstyled"
            borderBottom="1px"
            borderBottomColor="gray.200"
          >
            <thead />
            <tbody>
              <Tr p="1rem">
                <Td>
                  <Text color="#654D43" fontSize="12px" fontWeight={400}>
                    BLOCK
                  </Text>
                </Td>
                <Td isNumeric>{block.block_hash}</Td>
              </Tr>
              <Tr p="1rem">
                <Td>
                  <Text color="#654D43" fontSize="12px" fontWeight={400}>
                    TIME
                  </Text>
                </Td>
                <Td>{block.time}</Td>
              </Tr>
              <Tr p="1rem">
                <Td>
                  <Text color="#654D43" fontSize="12px" fontWeight={400}>
                    NUMBER OF TXS
                  </Text>
                </Td>
                <Td isNumeric>{block.num_of_txs}</Td>
              </Tr>
              <Tr p="1rem">
                <Td>
                  <Text color="#654D43" fontSize="12px" fontWeight={400}>
                    SIZE DATA
                  </Text>
                </Td>
                <Td isNumeric>{block.data_size}</Td>
              </Tr>
              <tr>
                <Td>
                  <Text color="#654D43" fontSize="12px" fontWeight={400}>
                    NODES
                  </Text>
                </Td>
                <Td isNumeric>{block.nodes}</Td>
              </tr>
            </tbody>
            <tfoot />
          </Table>
        </Stack>
      ))}
      <Box
        width="full"
        w={{ sm: "23em", md: "54em", lg: "82em" }}
        maxW="full"
        pt={0.5}
        backgroundColor={theme.colors.cream}
      />
      <Pagination {...pagination} />
    </Box>
  );
};
export default BlockListMobile;
