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
      <Text color={theme.colors.cream} fontSize="1.168rem" fontWeight={300}>
        THE
      </Text>
      <Text color={theme.colors.cream} fontSize="1.168rem" fontWeight={700}>
        LIFTED
      </Text>
      <Text color={theme.colors.cream} fontSize="1.168rem" fontWeight={300}>
        INITIATIVE
      </Text>
    </Box>
  );
};
export default function Logo() {
  return <LOGOSVG />;
}
