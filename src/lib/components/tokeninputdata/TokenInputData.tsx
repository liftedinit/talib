import { Box, Center, Code, Grid, GridItem, Text } from "@chakra-ui/react";

import InputTokenData from "../../../demodata/InputTokenData";
import { theme } from "lib/styles/customTheme";

interface Props {
  value: unknown;
  replacer: null;
  space: number;
}

const Log = ({ value, replacer, space }: Props) => (
  <pre
    style={{
      backgroundColor: "#E2E2E2",
      padding: 0,
      height: "200px",
    }}
  >
    <Code h={{ sm: "275px", md: "190px" }} overflowY="scroll">
      {JSON.stringify(value, replacer, space)
        .replaceAll("{", "")
        .replaceAll("}", "")}{" "}
    </Code>
  </pre>
);

const TokenInputData = () => {
  const tokenData = InputTokenData;
  return (
    <Center h={{ sm: "381px", md: "220px" }}>
      <Grid
        h={{ sm: "350px", md: "220px" }}
        w={{ sm: "23em", md: "48em", lg: "72em" }}
        maxW="full"
        templateColumns={{ sm: "repeat(1, 1fr)", md: "repeat(4, 1fr)" }}
        gap={1}
        bg={theme.colors.white}
        borderRadius="md"
        alignItems={{ sm: "start", md: "center" }}
        paddingY={{ sm: "15px", md: "25px" }}
        paddingX={{ sm: "0px", md: "25px" }}
      >
        <GridItem w="100%" h={{ sm: "5px", md: "160px" }} colSpan={1}>
          <Text h={{ sm: "5px", md: "160px" }}>INPUT DATA</Text>
        </GridItem>
        <GridItem w="100%" h={{ sm: "275px", md: "200px" }} colSpan={3}>
          <Box
            bg={theme.colors.grey}
            color={theme.colors.black}
            h="100%"
            overflow={{ sm: "scroll", md: "hidden" }}
          >
            <Log value={tokenData} replacer={null} space={2} />
          </Box>
        </GridItem>
      </Grid>
    </Center>
  );
};

export default TokenInputData;
