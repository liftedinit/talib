import {
  Box,
  Container,
  SimpleGrid,
  Stack,
  Divider,
  GridItem,
} from "@chakra-ui/react";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from "react";

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
      height={{ sm: "600px", md: "400px" }}
    >
      <Container as={Stack} maxW="full" py={10}>
        <SimpleGrid
          templateColumns={{ sm: "repeat(1, 1fr)", md: "repeat(4, 1fr)" }}
          gap={10}
          spacing={8}
        >
          <GridItem colSpan={{ sm: 1, md: 2 }}>
            <Logo
              boxSize="85px"
              fontSize="1.168rem"
              fontColor={theme.colors.cream}
            />
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
