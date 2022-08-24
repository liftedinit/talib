import { Box, Flex, Spacer, Link, Stack, Button } from "@chakra-ui/react";

import Logo from "lib/components/logo/Logo";
import { theme } from "lib/styles/customTheme";

export default function MenuDesktop() {
  return (
    <Flex>
      <Logo boxSize="25px" fontSize="1.168rem" fontColor={theme.colors.black} />
      <Spacer />
      <Box display="flex" alignItems="center">
        <Stack direction="row" spacing={8}>
          <Link
            fontWeight="bold"
            fontSize={{ sm: "0.875rem", md: "1.168rem" }}
            ml={5}
            _hover={{ textDecoration: "none" }}
          >
            Blocks
          </Link>
          <Link
            ml={5}
            fontSize={{ sm: "0.875rem", md: "1.168rem" }}
            _hover={{ textDecoration: "none" }}
          >
            Nodes
          </Link>
        </Stack>
      </Box>
      <Spacer />
      <Box>
        <Stack direction="row" spacing={6}>
          <Button
            size={{ sm: "sm", md: "md" }}
            colorScheme="teal"
            variant="solid"
          >
            Sign Up
          </Button>
          <Button
            size={{ sm: "sm", md: "md" }}
            colorScheme="teal"
            variant="outline"
          >
            Sign In
          </Button>
        </Stack>
      </Box>
    </Flex>
  );
}
