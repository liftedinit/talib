// Recommended for icons
import {
  Pagination,
  usePagination,
  PaginationNext,
  PaginationPrevious,
  PaginationContainer,
  PaginationPageGroup,
  PaginationPage,
} from "@ajna/pagination";
import { Box, Text, ChakraProvider } from "@chakra-ui/react";
import { useEffect, useState } from "react";

import { NoContent } from "../../customtable/components/NoContent";
import type Block from "lib/types/block";

interface Props {
  blocks: Block[];
}

const BlockListMobile = ({ blocks }: Props) => {
  // constants

  const [totalItems, setTotalItems] = useState<number | undefined>(undefined);
  const [listItems, setListItems] = useState<any[]>([]);

  // Control current Page
  const { pages, pagesCount, offset, currentPage, setCurrentPage, pageSize } =
    usePagination({
      total: totalItems,
      initialState: {
        currentPage: 1,
        pageSize: 4,
      },
    });

  // effects
  useEffect(() => {
    setTotalItems(blocks.length);
    setListItems(blocks);
  }, [currentPage, pageSize, offset, blocks]);

  const handlePageChange = (nextPage: number): void => {
    // -> request new data using the page number
    setCurrentPage(nextPage);
  };

  if (blocks.length === 0) {
    return <NoContent text="No information to show." />;
  }

  return (
    <Box>
      <ChakraProvider>
        {listItems?.map((block: Block) => (
          <Box key={block.id}>{block.id}</Box>
        ))}

        <Pagination
          pagesCount={pagesCount}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        >
          <PaginationContainer>
            <PaginationPrevious>{"<"}</PaginationPrevious>
            <PaginationPageGroup>
              {pages.map((page: number) => (
                <PaginationPage key={`pagination_page_${page}`} page={page} />
              ))}
            </PaginationPageGroup>
            <PaginationNext
              _hover={{
                bg: "yellow.400",
              }}
              bg="yellow.300"
            >
              <Text>{">"}</Text>
            </PaginationNext>
          </PaginationContainer>
        </Pagination>
      </ChakraProvider>
    </Box>
  );
};

export default BlockListMobile;
