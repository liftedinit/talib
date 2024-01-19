import {
  Box,
  Center,
  Grid,
  GridItem,
  Heading,
  Image,
  logoSvg,
  HStack,
  DarkMode,
} from "@liftedinit/ui";
import { Search, DarkModeToggle, TopNav } from "ui";
import { useBgColor } from "utils";
import { NeighborhoodSelector } from "./selector";

const navItems = [
  { label: "Talib", link: "/" },
  { label: "Metrics", link: "/metrics"},
  { label: "Map", link: "/map" },
];

export function Navbar() {

  const bg = useBgColor();

  return (
    <>
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
        <TopNav navItems={navItems} />
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
      <HStack justify="flex-end">
        <NeighborhoodSelector />
        <Heading size="md">
          <DarkModeToggle />
        </Heading>
      </HStack>
    </GridItem>
    </Grid>
    </>
  );
}