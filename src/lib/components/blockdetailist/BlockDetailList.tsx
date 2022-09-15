// Use Chakra Ui for create a custom component for display field data in table
import { Box, Heading, Center } from "@chakra-ui/react";
// Recommended for icons
import React from "react";

import BlockDetailData from "../../../demodata/BlockDetailData";
import { Table } from "lib/components/customtable/CustomTable";
import { theme } from "lib/styles/customTheme";

type BlockDetail = {
  id: number;
  block_hash: string;
  time: string;
  from: string;
  to: string;
  type: string;
};

// Example list of blocks, to replace it with many.js block list get method
const blocks: BlockDetail[] = BlockDetailData;

const BlockDetailList = () => {
  // Control current Page
  const [page, setPage] = React.useState(1);

  // Formatter for each user
  const tableData = blocks.map((block) => ({
    block_hash: block.block_hash,
    time: block.time,
    from: block.from,
    to: block.to,
    type: block.type,
  }));

  // Accessor to get a data in block object
  const tableColumns = [
    {
      Header: "TSX / HASH",
      accessor: "block_hash" as const,
    },
    {
      Header: "TIME",
      accessor: "time" as const,
    },
    {
      Header: "TO",
      accessor: "to" as const,
    },
    {
      Header: "FROM",
      accessor: "from" as const,
    },
    {
      Header: "TYPE",
      accessor: "type" as const,
    },
  ];

  return (
    <Center maxW="full" fontSize="14px">
      <Box w={{ sm: "23em", md: "54em", lg: "82em" }} py="1">
        <Heading fontSize="24px" fontWeight={400} as="h3">
          History
        </Heading>

        <Box
          backgroundColor="white"
          w={{ sm: "23em", md: "54em", lg: "82em" }}
          mt="2"
        >
          <Table
            colorScheme={theme.colors.brown}
            // Fallback component when list is empty
            emptyData={{
              text: "Any transaction registered here.",
            }}
            totalRegisters={blocks.length}
            page={page}
            // Listen change page event and control the current page using state
            // eslint-disable-next-line @typescript-eslint/no-shadow
            onPageChange={(page) => setPage(page)}
            columns={tableColumns}
            data={tableData}
          />
        </Box>
      </Box>
    </Center>
  );
};

export default BlockDetailList;
