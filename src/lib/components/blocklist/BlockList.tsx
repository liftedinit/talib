// Use Chakra Ui for create a custom component for display field data in table
import { Box, Heading, Center, useMediaQuery } from "@chakra-ui/react";

import BlockListDesktop from "./blocklistdesktop/BlockListDesktop";
import BlockListMobile from "./blocklistmobile/BlockListMobile";

type Block = {
  id: number;
  block_hash: string;
  time: string;
  num_of_txs: string;
  data_size: string;
  nodes: string;
};

// Example list of blocks, to replace it with many.js block list get method
let blocks: Block[] = [
  {
    id: 1,
    block_hash: "457676765",
    time: "2hs 36min ago",
    num_of_txs: "9582305095533",
    data_size: "5435364646666",
    nodes: "94380454644",
  },
  {
    id: 2,
    block_hash: "832785237",
    time: "4hs 17mins ago",
    num_of_txs: "9588675095533",
    data_size: "5435364646666",
    nodes: "943807171714",
  },
  {
    id: 3,
    block_hash: "756465466",
    time: "4hs 54mins ago",
    num_of_txs: "9588655095533",
    data_size: "4356664646666",
    nodes: "9438048344",
  },
  {
    id: 4,
    block_hash: "5465757566",
    time: "6hs 46mins ago",
    num_of_txs: "9582305095533",
    data_size: "54353649877886",
    nodes: "8439000008349",
  },
  {
    id: 5,
    block_hash: "832785237",
    time: "4hs 16mins ago",
    num_of_txs: "9588675095533",
    data_size: "5435364646666",
    nodes: "943807171714",
  },
  {
    id: 6,
    block_hash: "756465466",
    time: "4hs 54mins ago",
    num_of_txs: "9588655095533",
    data_size: "4356664646666",
    nodes: "9438048344",
  },
  {
    id: 7,
    block_hash: "5465757566",
    time: "6hs 46mins ago",
    num_of_txs: "9582305095533",
    data_size: "54353649877886",
    nodes: "8439000008349",
  },
  {
    id: 8,
    block_hash: "832785237",
    time: "4hs 16mins ago",
    num_of_txs: "9588675095533",
    data_size: "5435364646666",
    nodes: "943807171714",
  },
  {
    id: 6,
    block_hash: "756465466",
    time: "4hs 54mins ago",
    num_of_txs: 9588655095533,
    data_size: 4356664646666,
    nodes: 9438048344,
  },
  {
    id: 7,
    block_hash: "5465757566",
    time: "6hs 46mins ago",
    num_of_txs: 9582305095533,
    data_size: 54353649877886,
    nodes: 8439000008349,
  },
  {
    id: 8,
    block_hash: "832785237",
    time: "4hs 16mins ago",
    num_of_txs: 9588675095533,
    data_size: 5435364646666,
    nodes: 943807171714,
  },
  {
    id: 9,
    block_hash: "756465466",
    time: "4hs 54mins ago",
    num_of_txs: 9588655095533,
    data_size: 4356664646666,
    nodes: 9438048344,
  },
  {
    id: 10,
    block_hash: "5465757566",
    time: "6hs 46mins ago",
    num_of_txs: 9582305095533,
    data_size: 54353649877886,
    nodes: 8439000008349,
  },
  {
    id: 11,
    block_hash: "832785237",
    time: "4hs 16mins ago",
    num_of_txs: 9588675095533,
    data_size: 5435364646666,
    nodes: 943807171714,
  },
  {
    id: 12,
    block_hash: "756465466",
    time: "4hs 54mins ago",
    num_of_txs: 9588655095533,
    data_size: 4356664646666,
    nodes: 9438048344,
  },
  {
    id: 13,
    block_hash: "5465757566",
    time: "6hs 46mins ago",
    num_of_txs: 9582305095533,
    data_size: 54353649877886,
    nodes: 8439000008349,
  },
  {
    id: 14,
    block_hash: "832785237",
    time: "4hs 16mins ago",
    num_of_txs: 9588675095533,
    data_size: 5435364646666,
    nodes: 943807171714,
  },
  {
    id: 15,
    block_hash: "756465466",
    time: "4hs 54mins ago",
    num_of_txs: 9588655095533,
    data_size: 4356664646666,
    nodes: 9438048344,
  },
  {
    id: 16,
    block_hash: "5465757566",
    time: "6hs 46mins ago",
    num_of_txs: 9582305095533,
    data_size: 54353649877886,
    nodes: 8439000008349,
  },
  {
    id: 17,
    block_hash: "832785237",
    time: "4hs 16mins ago",
    num_of_txs: 9588675095533,
    data_size: 5435364646666,
    nodes: 943807171714,
  },
  {
    id: 18,
    block_hash: "756465466",
    time: "4hs 54mins ago",
    num_of_txs: 9588655095533,
    data_size: 4356664646666,
    nodes: 9438048344,
  },
  {
    id: 19,
    block_hash: "5465757566",
    time: "6hs 46mins ago",
    num_of_txs: 9582305095533,
    data_size: 54353649877886,
    nodes: 8439000008349,
  },
  {
    id: 20,
    block_hash: "832785237",
    time: "4hs 16mins ago",
    num_of_txs: 9588675095533,
    data_size: 5435364646666,
    nodes: 943807171714,
  },
  {
    id: 21,
    block_hash: "756465466",
    time: "4hs 54mins ago",
    num_of_txs: 9588655095533,
    data_size: 4356664646666,
    nodes: 9438048344,
  },
  {
    id: 22,
    block_hash: "5465757566",
    time: "6hs 46mins ago",
    num_of_txs: 9582305095533,
    data_size: 54353649877886,
    nodes: 8439000008349,
  },
  {
    id: 23,
    block_hash: "832785237",
    time: "4hs 16mins ago",
    num_of_txs: 9588675095533,
    data_size: 5435364646666,
    nodes: 943807171714,
  },
];

const BlockList = () => {
  const [isMobile] = useMediaQuery("(max-width: 480px)");

  const displayDesktop = () => {
    return <BlockListDesktop blocks={blocks} />;
  };

  const displayMobile = () => {
    return <BlockListMobile blocks={blocks} />;
  };

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
          {isMobile ? displayMobile() : displayDesktop()}
        </Box>
      </Box>
    </Center>
  );
};

export default BlockList;
