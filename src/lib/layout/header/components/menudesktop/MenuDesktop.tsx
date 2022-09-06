import { Box, Flex, Spacer, Link, Stack } from "@chakra-ui/react";
import { useLocation } from "react-router-dom";

import Logo from "lib/components/logo/Logo";
import { theme } from "lib/styles/customTheme";

export default function MenuDesktop() {
  const location = useLocation();

  // destructuring pathname from location
  const { pathname } = location;

  // Javascript split method to get the name of the path in array
  const splitLocation = pathname.split("/");

  return (
    <Flex>
      <Logo boxSize="25px" fontSize="1.168rem" fontColor={theme.colors.black} />
      <Spacer />
      <Box display="flex" alignItems="center">
        <Stack direction="row" spacing={8}>
          <Link
            fontSize={{ sm: "0.875rem", md: "1.168rem" }}
            ml={5}
            _hover={{ textDecoration: "none", color: theme.colors.black }}
            href="/"
            fontWeight={splitLocation[1] === "" ? "bold" : "normal"}
          >
            Blocks
          </Link>
          <Link
            ml={5}
            fontSize={{ sm: "0.875rem", md: "1.168rem" }}
            _hover={{ textDecoration: "none", color: theme.colors.black }}
            href="/nodes"
            fontWeight={splitLocation[1] === "nodes" ? "bold" : "normal"}
          >
            Nodes
          </Link>
        </Stack>
      </Box>
    </Flex>
  );
}
