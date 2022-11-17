// Use Chakra Ui for create a custom component for display field data in table
import { Box, Heading, Center, useMediaQuery } from "@chakra-ui/react";
import { useEffect } from "react";
// import { resourceLimits } from "worker_threads";

import Api from "lib/config/api";
import type Block from "lib/types/block";
import type PreprocessBlock from "lib/types/preprocessBlock";

import BlockListDesktop from "./blocklistdesktop/BlockListDesktop";
import BlockListMobile from "./blocklistmobile/BlockListMobile";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function processData(data: PreprocessBlock[]) {
  // eslint-disable-next-line no-console
  console.log("es objeto:");
  /*
  Object.entries(data).forEach(([key, value]) => {
    Object.assign(results, {
      id: value.id,
      block_hash: {
        value: value.block_hash,
        link: `/block/${value.block_hash}`,
      },
      time: value.time,
      num_of_txs: value.num_of_txs,
    });
  });
  */
  /*
  let results: any = data.map((dat) => {
    const result: Block[] = {
      id: dat.id,
      block_hash: {
        value: dat.block_hash,
        link: `/block/${dat.block_hash}`,
      },
      time: dat.time,
      num_of_txs: dat.num_of_txs,
    };
    results.push(result);
    return results;
  });
  */
}

const BlockList = () => {
  // todo: replace with real method to get information and remove the demodata import
  // GET BlockList from API
  // eslint-disable-next-line consistent-return
  const getBlockList = async () => {
    try {
      const response = await fetch(Api.endpoint.blocklist, Api.options);
      const data = await response.json();
      // eslint-disable-next-line no-console
      return processData(data[0]);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(e);
    }
  };
  useEffect(() => {
    getBlockList();
  });

  const blocks: Promise<Block[] | undefined> = getBlockList();

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
