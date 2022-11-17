import { Box } from "@chakra-ui/react";

import { theme } from "lib/styles/customTheme";

import NoMenu from "./nomenu/NoMenu";

const Header = () => {
  return (
    <Box
      w="100%"
      padding="8"
      bg={theme.colors.cream}
      color={theme.colors.black}
      maxHeight="90px"
    >
      <NoMenu />
    </Box>
  );
};

export default Header;
