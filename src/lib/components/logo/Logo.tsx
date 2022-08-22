import { Image, Box, Text } from "@chakra-ui/react";

import { theme } from "lib/styles/customTheme";

const LOGOSVG = () => {
  return (
    <Box display="flex" alignItems="center">
      <Image
        boxSize="100px"
        objectFit="cover"
        src="/assets/lifted.svg"
        title="The Lifted initiative"
      />
      <Text color={theme.colors.cream} fontSize="sm">
        THE
      </Text>
      <Text color={theme.colors.cream} fontSize="sm" fontWeight="bold">
        LIFTED
      </Text>
      <Text color={theme.colors.cream} fontSize="sm">
        INITIATIVE
      </Text>
    </Box>
  );
};
export default function Logo() {
  return <LOGOSVG />;
}
