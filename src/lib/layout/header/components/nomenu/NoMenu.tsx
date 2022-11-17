import { Box, Center } from "@chakra-ui/react";

import Logo from "lib/components/logo/Logo";
import { theme } from "lib/styles/customTheme";

export default function NoMenu() {
  return (
    <header>
      <Box>
        <Center>
          <Logo
            boxSize="25px"
            fontSize="1.168rem"
            fontColor={theme.colors.black}
          />
        </Center>
      </Box>
    </header>
  );
}
