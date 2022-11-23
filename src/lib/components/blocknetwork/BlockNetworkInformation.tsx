import { HStack, VStack, Box, Heading, Icon, Text } from "@chakra-ui/react";
import {
  Blockchain,
  Network,
  AnonymousIdentity,
  Base,
} from "@liftedinit/many-js";
import type { InfoReturns } from "@liftedinit/many-js";
import { useEffect, useState } from "react";
import { FaTrophy, FaCube, FaCode } from "react-icons/all";

import Hcard from "../hcard/Hcard";
import { theme } from "lib/styles/customTheme";

const anonymous = new AnonymousIdentity(); // => Anonymous Address
const network = new Network("http://localhost:8000/", anonymous);
network.apply([Blockchain, Base]);

// get NetworkInformation
async function getNetworkInfo() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data: any = await network.base.status();
  return data.status;
}
// get Info latestBlock height
async function getLatestBlockInfo() {
  const data: InfoReturns = await network.blockchain.info();
  return data.info?.latestBlock.height;
}

const CircleIcon = (props) => (
  <Icon viewBox="0 0 200 200" {...props}>
    <path
      fill="currentColor"
      d="M 100, 100 m -75, 0 a 75,75 0 1,0 150,0 a 75,75 0 1,0 -150,0"
    />
  </Icon>
);

const BlockNetworkInformation = () => {
  // Defined data states
  const [ServerVersion, setServerVersion] = useState(0);
  const [ProtocolVersion, setProtocolVersion] = useState(0);
  const [BlockHeight, setBlockHeight] = useState(0);

  // GET Blockchain Network Information from API
  const getNetworkInformation = async () => {
    try {
      const dataNetwork = await getNetworkInfo();
      const dataBlockInfo = await getLatestBlockInfo();

      setServerVersion(dataNetwork[0].serverVersion);
      setProtocolVersion(dataNetwork[0].protocolVersion);
      setBlockHeight(dataBlockInfo);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(e);
    }
  };
  useEffect(() => {
    getNetworkInformation();
  });

  return (
    <VStack maxW="full">
      <VStack maxW="full" alignItems="left">
        <Box>
          <Heading
            fontSize="2.25rem"
            fontWeight={600}
            as="h1"
            color={theme.colors.cream}
          >
            Manifest
          </Heading>
        </Box>
        <Box as="span" display="flex">
          <CircleIcon color={theme.colors.green} boxSize={6} />
          <Text color={theme.colors.cream} fontWeight={900} fontSize="0.75rem">
            currently available
          </Text>
        </Box>
      </VStack>
      <HStack mt="70px" maxW="full">
        <Hcard
          title="Block Height"
          icon={FaCube}
          content={String(BlockHeight)}
        />

        <Hcard
          title="Protocol Version"
          icon={FaTrophy}
          content={String(ProtocolVersion)}
        />
        <Hcard
          title="Software Version"
          icon={FaCode}
          content={String(ServerVersion)}
        />
      </HStack>
    </VStack>
  );
};

export default BlockNetworkInformation;
