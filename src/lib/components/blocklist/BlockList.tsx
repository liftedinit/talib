// Use Chakra Ui for create a custom component for display field data in table
import { Box, Heading, Center } from "@chakra-ui/react";
// Recommended for icons
import React from "react";

import { Table } from "lib/components/customtable/CustomTable";
import { theme } from "lib/styles/customTheme";

type Block = {
  id: number;
  block_hash: string;
  time: string;
  num_of_txs: number;
  data_size: number;
  nodes: number;
};

// Example list of blocks, to replace it with many.js block list get method
const blocks: Block[] = [
  {
    id: 1,
    block_hash: "457676765",
    time: "2hs 36min ago",
    num_of_txs: 9582305095533,
    data_size: 5435364646666,
    nodes: 94380454644,
  },
  {
    id: 2,
    block_hash: "832785237",
    time: "4hs 16mins ago",
    num_of_txs: 9588675095533,
    data_size: 5435364646666,
    nodes: 943807171714,
  },
  {
    id: 3,
    block_hash: "756465466",
    time: "4hs 54mins ago",
    num_of_txs: 9588655095533,
    data_size: 4356664646666,
    nodes: 9438048344,
  },
  {
    id: 4,
    block_hash: "5465757566",
    time: "6hs 46mins ago",
    num_of_txs: 9582305095533,
    data_size: 54353649877886,
    nodes: 8439000008349,
  },
  {
    id: 5,
    block_hash: "832785237",
    time: "4hs 16mins ago",
    num_of_txs: 9588675095533,
    data_size: 5435364646666,
    nodes: 943807171714,
  },
];

const BlockList = () => {
  // Control current Page
  const [page, setPage] = React.useState(1);

  // Formatter for each user
  const tableData = blocks.map((block) => ({
    block_hash: block.block_hash,
    time: block.time,
    num_of_txs: block.num_of_txs,
    data_size: block.data_size,
    nodes: block.nodes,
  }));

  // Accessor to get a data in block object
  const tableColumns = [
    {
      Header: "BLOCK",
      accessor: "block_hash" as const,
    },
    {
      Header: "TIME",
      accessor: "time" as const,
    },
    {
      Header: "NUMBER OF TXS",
      accessor: "num_of_txs" as const,
    },
    {
      Header: "SIZE DATA",
      accessor: "data_size" as const,
    },
    {
      Header: "NODES",
      accessor: "nodes" as const,
    },
  ];

  return (
    <Center maxW="full" fontSize="14px">
      <Box w={{ sm: "23em", md: "54em", lg: "82em" }} py="1">
        <Heading fontSize="24px" fontWeight={400} as="h3">
          Block List
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

export default BlockList;
