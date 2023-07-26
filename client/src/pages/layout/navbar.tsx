import {
  Box,
  Button,
  Center,
  Grid,
  GridItem,
  Heading,
  Image,
  logoSvg,
  Stack,
  HStack,
} from "@liftedinit/ui";
import { Link } from "react-router-dom";
import { Search } from "ui";

import { NeighborhoodSelector } from "./selector";

export function Navbar() {

  return (
    <Grid
    bg="white"
    shadow="lg"
    alignItems="center"
    templateColumns="430px 1fr 430px"
    p={6}
    gap={6}
    >
    <GridItem>
      <Stack direction="row">
        <Image src={logoSvg} h="67px" mr={3} alt="Lifted Logo" />
        <Heading lineHeight="67px" size="md" fontWeight="normal">
          <Link to="/">Talib</Link>
        </Heading>
      </Stack>
    </GridItem>
    <GridItem>
      <Center>
        <Box w="100%" maxW="container.lg">
          <Search />
        </Box>
      </Center>
    </GridItem>
    <GridItem>
      <HStack>
        <Heading lineHeight="67px" size="md" fontWeight="normal" marginRight="20px">
          <Button colorScheme='brand.teal' size="md">
          <Link to="/metrics">Metrics</Link>
          </Button>
        </Heading>
        <NeighborhoodSelector />
      </HStack>
    </GridItem>
    </Grid>
  );
}