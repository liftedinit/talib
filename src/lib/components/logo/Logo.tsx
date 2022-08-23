import { Image, Box, Text } from "@chakra-ui/react";

import { theme } from "lib/styles/customTheme";

interface Props {
  boxSize: string;
  fontSize: string;
}

const Logo = ({ boxSize, fontSize }: Props) => {
  return (
    <Box display="flex" alignItems="center">
      <Image
        boxSize={boxSize}
        objectFit="cover"
        src="/assets/lifted.svg"
        title="The Lifted initiative"
      />
      <Text color={theme.colors.cream} fontSize={fontSize} fontWeight={300}>
        THE
      </Text>
      <Text color={theme.colors.cream} fontSize={fontSize} fontWeight={700}>
        LIFTED
      </Text>
      <Text color={theme.colors.cream} fontSize={fontSize} fontWeight={300}>
        INITIATIVE
      </Text>
    </Box>
  );
};
export default Logo;
