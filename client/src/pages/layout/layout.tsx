import {
  Box,
  Center,
  Container,
  Grid,
  GridItem,
  Heading,
  Image,
  logoSvg,
  Stack,
} from "@liftedinit/ui";
import { Link } from "react-router-dom";
import { Search } from "ui";

import { NeighborhoodSelector } from "./selector";

export function Layout({ children }: React.PropsWithChildren<{}>) {
  return (
    <>
      <Grid
        bg="white"
        shadow="lg"
        alignItems="center"
        templateColumns="200px 1fr 200px"
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
          <NeighborhoodSelector />
        </GridItem>
      </Grid>
      <Container maxW="container.lg">{children}</Container>
    </>
  );
}
