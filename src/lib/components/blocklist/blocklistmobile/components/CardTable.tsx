import {
  Table as ChakraTable,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Text,
  Td,
  Box,
  Stack,
} from "@chakra-ui/react";
import React from "react";
import { MdBrokenImage } from "react-icons/md";

import { NoContent } from "lib/components/customtable/components/NoContent";
import type { NoContentProps } from "lib/components/customtable/components/NoContent";
import { Pagination } from "lib/components/customtable/components/Pagination";
import { usePagination } from "lib/components/customtable/hooks/usePagination";
import { theme } from "lib/styles/customTheme";

type DataType = {
  [key: string]: JSX.Element | string;
};

type EmptyMessage = Partial<NoContentProps>;

interface CardTableProps {
  data: DataType[];
  page: number;
  totalRegisters: number;
  onPageChange: (page: number) => void;
  colorScheme?: "teal";
  emptyData?: EmptyMessage;
}

export function CardTable({
  page,
  onPageChange,
  totalRegisters,
  data,
  colorScheme = "teal",
  emptyData,
}: CardTableProps) {
  const pagination = usePagination({
    totalRegisters,
    page,
    items: data,
  });
  const blocks = Object.values(data);

  if (blocks.length === 0) {
    return (
      <NoContent
        {...emptyData}
        icon={emptyData?.icon ?? MdBrokenImage}
        text={emptyData?.text ?? "Any transaction registered here."}
      >
        {emptyData?.children ?? null}
      </NoContent>
    );
  }

  return (
    <Box
      width="full"
      w={{ sm: "23em", md: "54em", lg: "82em" }}
      maxW="full"
      pt={0.5}
      backgroundColor={theme.colors.cream}
      overflow="hidden"
    >
      {blocks.map((block, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <React.Fragment key={index}>
          <Stack>
            <ChakraTable
              variant="unstyled"
              borderBottom="1px"
              borderBottomColor="gray.200"
            >
              <Thead />
              <Tbody>
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
              </Tbody>
              <Tfoot />
            </ChakraTable>
          </Stack>
        </React.Fragment>
      ))}
      <Box
        width="full"
        w={{ sm: "23em", md: "54em", lg: "82em" }}
        maxW="full"
        pt={0.5}
        backgroundColor={theme.colors.cream}
      >
        <Pagination
          {...pagination}
          colorScheme={colorScheme}
          // eslint-disable-next-line @typescript-eslint/no-shadow
          onPageChange={onPageChange}
        />
      </Box>
    </Box>
  );
}
