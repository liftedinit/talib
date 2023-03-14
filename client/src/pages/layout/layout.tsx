import {
  Container,
  Flex,
  Heading,
  Image,
  logoSvg,
  Stack,
  Text,
} from "@liftedinit/ui";
import { Link } from "react-router-dom";

import { NeighborhoodSelector } from "./selector";

export function Layout({ children }: React.PropsWithChildren<{}>) {
  return (
    <>
      <Flex
        bg="white"
        shadow="lg"
        justify="space-between"
        alignItems="center"
        p={6}
      >
        <Stack direction="row">
          <Image src={logoSvg} h="67px" mr={3} alt="Lifted Logo" />
          <Heading lineHeight="67px" size="md" fontWeight="normal">
            <Link to="/">Talib</Link>
          </Heading>
        </Stack>
        <Text>A block explorer for the Many protocol</Text>
        <NeighborhoodSelector />
      </Flex>
      <Container maxW="container.lg">{children}</Container>
    </>
  );
}
