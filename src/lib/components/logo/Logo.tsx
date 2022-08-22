import { Image, Box, Text } from "@chakra-ui/react";

const LOGOSVG = () => {
  return (
    <Box display="flex" alignItems="center">
      <Image
        boxSize="100px"
        objectFit="cover"
        src="/assets/lifted.svg"
        title="The Lifted initiative"
      />
      <Text fontSize="sm">THELIFTEDINITIATIVE</Text>
    </Box>
  );
};
export default function Logo() {
  return <LOGOSVG />;
}
