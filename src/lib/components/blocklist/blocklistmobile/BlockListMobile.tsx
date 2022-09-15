// Recommended for icons
import {
  Pagination,
  usePagination,
  PaginationNext,
  PaginationPrevious,
  PaginationContainer,
  PaginationPageGroup,
} from "@ajna/pagination";
import {
  Box,
  Stack,
  Text,
  Table,
  Tr,
  Td,
  ChakraProvider,
} from "@chakra-ui/react";

import { NoContent } from "../../customtable/components/NoContent";

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
  const { currentPage, setCurrentPage, pagesCount } = usePagination({
    pagesCount: 1,
    initialState: { currentPage: 1 },
  });

  if (blocks.length === 0) {
    return <NoContent text="No information to show." />;
  }

  return (
    <Box>
      {blocks.map((block) => (
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

      <ChakraProvider>
        <Pagination
          pagesCount={pagesCount}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        >
          <PaginationContainer>
            <PaginationPrevious>Previous</PaginationPrevious>
            <PaginationPageGroup />
            <PaginationNext
              _hover={{
                bg: "yellow.400",
              }}
              bg="yellow.300"
            >
              <Text>Next</Text>
            </PaginationNext>
          </PaginationContainer>
        </Pagination>
      </ChakraProvider>
    </Box>
  );
};

export default BlockListMobile;
