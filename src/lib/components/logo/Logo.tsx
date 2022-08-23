import { Image, Box, Text } from "@chakra-ui/react";

interface Props {
  boxSize: string;
  fontSize: string;
  fontColor: string;
}

const Logo = ({ boxSize, fontSize, fontColor }: Props) => {
  return (
    <Box display="flex" alignItems="center">
      <Image
        boxSize={boxSize}
        objectFit="cover"
        src="/assets/lifted.svg"
        title="The Lifted initiative"
      />
      <Text color={fontColor} fontSize={fontSize} fontWeight={300}>
        THE
      </Text>
      <Text color={fontColor} fontSize={fontSize} fontWeight={700}>
        LIFTED
      </Text>
      <Text color={fontColor} fontSize={fontSize} fontWeight={300}>
        INITIATIVE
      </Text>
    </Box>
  );
};
export default Logo;
