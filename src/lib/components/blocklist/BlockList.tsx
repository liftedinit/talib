// Use Chakra Ui for create a custom component for display field data in table
import { Box, Heading, Center, useMediaQuery } from "@chakra-ui/react";

import BlocksData from "../../../demodata/BlocksData";
import type Block from "lib/types/block";

import BlockListDesktop from "./blocklistdesktop/BlockListDesktop";
import BlockListMobile from "./blocklistmobile/BlockListMobile";

// todo: replace with real method to get information and remove the demodata import
const blocks: Block[] = BlocksData;

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
