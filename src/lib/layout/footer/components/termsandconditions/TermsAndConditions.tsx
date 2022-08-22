import { Box, Stack, Link } from "@chakra-ui/react";

import { theme } from "lib/styles/customTheme";

export default function TermsAndConditions() {
  return (
    <Stack align={{ md: "flex-end", sm: "center" }} spacing={6}>
      <Box fontSize="0.875rem" fontWeight={500}>
        <Link
          color={theme.colors.cream}
          href="https://theliftedinit.org/terms"
          ml={3}
        >
          Terms
        </Link>
        <Link
          color={theme.colors.cream}
          href="https://theliftedinit.org/protocol"
          ml={3}
        >
          Protocol
        </Link>
        <Link
          color={theme.colors.cream}
          href="https://theliftedinit.org/cookies"
          ml={3}
        >
          Cookies
        </Link>
      </Box>
    </Stack>
  );
}
