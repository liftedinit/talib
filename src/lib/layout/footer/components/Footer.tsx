import {
  Box,
  Container,
  SimpleGrid,
  Stack,
  Divider,
  GridItem,
} from "@chakra-ui/react";

import Logo from "lib/components/logo/Logo";
import { theme } from "lib/styles/customTheme";

import Copyright from "./copyright/Copyright";
import Sitemap from "./sitemap/Sitemap";
import SocialLinks from "./sociallinks/SocialLinks";
import TermsAndConditions from "./termsandconditions/TermsAndConditions";

export default function Footer() {
  return (
    <Box
      as="footer"
      bg={theme.colors.brown}
      color={theme.colors.cream}
      alignContent="center"
      w="100%"
    >
      <Container as={Stack} maxW="full" py={10}>
        <SimpleGrid
          templateColumns={{ sm: "repeat(1, 1fr)", md: "repeat(4, 1fr)" }}
          gap={10}
          spacing={8}
        >
          <GridItem colSpan={{ sm: 1, md: 2 }}>
            <Logo />
          </GridItem>
          <GridItem colSpan={1}>
            <Sitemap />
          </GridItem>
          <GridItem colSpan={1}>
            <SocialLinks />
          </GridItem>
        </SimpleGrid>
        <Divider orientation="horizontal" />
        <SimpleGrid
          templateColumns={{ sm: "repeat(1, 1fr)", md: "repeat(2, 1fr)" }}
          spacing={2}
        >
          <GridItem colSpan={1}>
            <Copyright />
          </GridItem>
          <GridItem colSpan={1}>
            <TermsAndConditions />
          </GridItem>
        </SimpleGrid>
      </Container>
    </Box>
  );
}
