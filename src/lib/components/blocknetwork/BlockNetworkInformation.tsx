import { HStack, VStack, Box, Heading, Icon, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
// import type BlockInformation from "lib/types/blockInformation";
import { FaTrophy, FaCube, FaCode } from "react-icons/all";

import Hcard from "../hcard/Hcard";
import Api from "lib/config/api";
import { theme } from "lib/styles/customTheme";

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
  const [Neighborhood, setNeighborhood] = useState(0);
  const [ServerVersion, setServerVersion] = useState(0);
  const [ProtocolVersion, setProtocolVersion] = useState(0);

  // GET Blockchain Network Information from API
  const getNetworkInformation = async () => {
    try {
      const response = await fetch(
        Api.endpoint.networkinformation,
        Api.options
      );
      const data = await response.json();
      setNeighborhood(data[0].neighborhood);
      setServerVersion(data[0].serverVersion);
      setProtocolVersion(data[0].protocolVersion);
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
            {String(Neighborhood)}
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
          title="Block Height "
          icon={FaCube}
          content={String(ProtocolVersion)}
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
