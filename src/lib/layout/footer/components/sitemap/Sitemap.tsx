import { Link, Stack } from "@chakra-ui/react";

export default function Sitemap() {
  return (
    <Stack mr={6} ml={6} align="flex-start">
      <Link href="https://theliftedinit.org/aboutus">
        About Lifted Initiative
      </Link>
      <Link href="https://theliftedinit.org/aboutprotocol">
        About the protocol
      </Link>
      <Link href="https://theliftedinit.org/documentationfordevs">
        Documentation for developers
      </Link>
      <Link href="https://theliftedinit.org/codeofconduct">
        Code of Conduct
      </Link>
    </Stack>
  );
}
