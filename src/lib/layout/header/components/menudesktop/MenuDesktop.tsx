import { Box, Flex, Spacer, Link, Stack, Button } from "@chakra-ui/react";

import Logo from "../../../../components/logo/Logo";
import { theme } from "lib/styles/customTheme";

export default function MenuDesktop() {
  return (
    <Flex>
      <Logo boxSize="20px" fontSize="20px" fontColor={theme.colors.black} />
      <Spacer />
      <Box display="flex" alignItems="center">
        <Stack direction="row" spacing={8}>
          <Link fontWeight="bold" ml={5} _hover={{ textDecoration: "none" }}>
            Blocks
          </Link>
          <Link ml={5} _hover={{ textDecoration: "none" }}>
            Nodes
          </Link>
        </Stack>
      </Box>
      <Spacer />
      <Box>
        <Stack direction="row" spacing={6}>
          <Button colorScheme="teal" variant="solid">
            Sign Up
          </Button>
          <Button colorScheme="teal" variant="outline">
            Sign In
          </Button>
        </Stack>
      </Box>
    </Flex>
  );
}
