import { Link, Stack } from "@chakra-ui/react";

import { theme } from "lib/styles/customTheme";

export default function Sitemap() {
  return (
    <Stack mr={6} ml={6} align="flex-start" fontWeight={400}>
      <Link color={theme.colors.white} href="https://theliftedinit.org/aboutus">
        About Lifted Initiative
      </Link>
      <Link
        color={theme.colors.white}
        href="https://theliftedinit.org/aboutprotocol"
      >
        About the protocol
      </Link>
      <Link
        color={theme.colors.white}
        href="https://theliftedinit.org/documentationfordevs"
      >
        Documentation for developers
      </Link>
      <Link
        color={theme.colors.white}
        href="https://theliftedinit.org/codeofconduct"
      >
        Code of Conduct
      </Link>
    </Stack>
  );
}
