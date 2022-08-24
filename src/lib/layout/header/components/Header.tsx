import { Box } from "@chakra-ui/react";

import { theme } from "lib/styles/customTheme";

import Navbar from "./navbar/NavBar";

const Header = () => {
  return (
    <Box
      w="100%"
      padding="8"
      bg={theme.colors.cream}
      color={theme.colors.black}
      maxHeight="100px"
    >
      <Navbar />
    </Box>
  );
};

export default Header;
