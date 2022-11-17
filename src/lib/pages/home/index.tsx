import { Stack, Container, Box } from "@chakra-ui/react";

import BlockNetworkInformation from "lib/components/blocknetwork/BlockNetworkInformation";

const Home = () => {
  return (
    <Container as={Stack} maxW="full" py={10}>
      <Box
        h="273px"
        p="0px"
        bg="url('/assets/background-search-brown.jpg')"
        bgPosition="center"
        bgRepeat="repeat"
        bgSize="contain"
      >
        <BlockNetworkInformation />
      </Box>
    </Container>
  );
};

export default Home;
