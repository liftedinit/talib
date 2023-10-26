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
  DarkMode,
} from "@liftedinit/ui";
import { Link } from "react-router-dom";
import { Search, DarkModeToggle } from "ui";
import { useBgColor } from "utils";
import { NeighborhoodSelector } from "./selector";

export function Navbar() {

  const bg = useBgColor();

  return (
    <Grid
    shadow="lg"
    bg={bg}
    alignItems="center"
    templateColumns="440px 1fr 440px"
    p={6}
    gap={6}
    >
    <GridItem>
      <HStack direction="row">
        <Image src={logoSvg} h="67px" mr={3} alt="Lifted Logo" />
        <Heading lineHeight="67px" size="md" fontWeight="normal">
          <Link to="/">Talib</Link>
        </Heading>
      </HStack>
    </GridItem>
    <GridItem>
      <Center>
        <Box w="100%" maxW="container.lg">
          <Search />
        </Box>
      </Center>
    </GridItem>
    <GridItem>
      <HStack display="flex" justifyContent="space-between">
        <Heading lineHeight="67px" size="md" fontWeight="normal" marginRight="20px" justify-self-end>
          <Button colorScheme='brand.teal' size="md">
          <Link to="/metrics">Metrics</Link>
          </Button>
        </Heading>
        <NeighborhoodSelector justify-self-end />
        <Heading size="md" justify-self-end>
          <DarkModeToggle />
        </Heading>
      </HStack>
    </GridItem>
    </Grid>
  );
}