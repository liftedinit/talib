import {
  Box,
  Center,
  Grid,
  GridItem,
  Heading,
  Stack,
  Text,
} from "@chakra-ui/react";

import { theme } from "lib/styles/customTheme";

const BlockDetail = () => {
  return (
    <Center h={{ sm: "681px", md: "200px" }}>
      <Box>
        <Box display="flex" flexFlow="row" alignItems="baseline">
          <Heading fontSize="32px" fontWeight={400} as="h3">
            BLOCK
          </Heading>
          <Text
            ml="3"
            color={theme.colors.green}
            fontWeight="400"
            lineHeight="24px"
            fontSize="16px"
          >
            #123456
          </Text>
        </Box>
        <Grid
          h={{ sm: "650px", md: "100px" }}
          w={{ sm: "23em", md: "48em", lg: "72em" }}
          maxW="full"
          templateColumns={{ sm: "repeat(1, 1fr)", md: "repeat(5, 1fr)" }}
          gap={2}
          bg={theme.colors.white}
          borderRadius="md"
          alignItems={{ sm: "start", md: "center" }}
          paddingTop={{ sm: "30px", md: "0px" }}
          mt="10px"
          paddingLeft={{ sm: "0px", md: "25px" }}
        >
          <GridItem w="100%" h="88px">
            <Box
              height="88px"
              display="flex"
              flexDirection="column"
              justifyContent="center"
              paddingLeft={{ sm: "25px", md: "0px" }}
              alignItems={{ sm: "start", md: "start" }}
            >
              <Stack display="flex" flexDirection="row" alignItems="center">
                <Text fontSize="24px" fontWeight="400" lineHeight="28px">
                  2 hs 1 min ago
                </Text>
                <Text
                  color={theme.colors.green}
                  fontWeight="400"
                  lineHeight="20px"
                  fontSize="14px"
                />
              </Stack>
              <Text
                color={theme.colors.brown}
                fontWeight="400"
                lineHeight="20px"
                fontSize="14px"
              >
                TIME
              </Text>
            </Box>
          </GridItem>
          <GridItem w="100%" h="88px">
            <Box
              height="88px"
              display="flex"
              flexDirection="column"
              justifyContent="center"
              paddingLeft={{ sm: "25px", md: "0px" }}
              alignItems={{ sm: "start", md: "start" }}
            >
              <Stack display="flex" flexDirection="row" alignItems="center">
                <Text fontSize="22px" fontWeight="400" lineHeight="28.44px">
                  545,774,135,429.02
                </Text>
                <Text fontWeight="400" lineHeight="20px" fontSize="14px">
                  usd
                </Text>
              </Stack>
              <Text
                color={theme.colors.brown}
                fontWeight="400"
                lineHeight="20px"
                fontSize="14px"
              >
                NUMBER OF TRANSACTIONS
              </Text>
            </Box>
          </GridItem>
          <GridItem w="100%" h="88px">
            <Box
              height="88px"
              display="flex"
              flexDirection="column"
              justifyContent="center"
              paddingLeft={{ sm: "25px", md: "0px" }}
              alignItems={{ sm: "start", md: "start" }}
            >
              <Stack display="flex" flexDirection="row" alignItems="center">
                <Text fontSize="24px" fontWeight="400" lineHeight="28px">
                  545,774,135,429.02
                </Text>
                <Text
                  color={theme.colors.green}
                  fontWeight="400"
                  lineHeight="20px"
                  fontSize="14px"
                />
              </Stack>
              <Text
                color={theme.colors.brown}
                fontWeight="400"
                lineHeight="20px"
                fontSize="14px"
              >
                SIZE DATA
              </Text>
            </Box>
          </GridItem>
          <GridItem w="100%" h="88px">
            <Box
              height="88px"
              display="flex"
              flexDirection="column"
              justifyContent="center"
              paddingLeft={{ sm: "25px", md: "0px" }}
              alignItems={{ sm: "start", md: "start" }}
            >
              <Stack display="flex" flexDirection="row" alignItems="center">
                <Text fontSize="24px" fontWeight="400" lineHeight="28px">
                  12345678
                </Text>
                <Text
                  color={theme.colors.green}
                  fontWeight="400"
                  lineHeight="20px"
                  fontSize="14px"
                />
              </Stack>
              <Text
                color={theme.colors.brown}
                fontWeight="400"
                lineHeight="20px"
                fontSize="14px"
              >
                NODES
              </Text>
            </Box>
          </GridItem>
          <GridItem w="100%" h="88px">
            <Box
              height="88px"
              display="flex"
              flexDirection="column"
              justifyContent="center"
              paddingLeft={{ sm: "25px", md: "0px" }}
              alignItems={{ sm: "start", md: "start" }}
            >
              <Stack display="flex" flexDirection="row" alignItems="center">
                <Text fontSize="24px" fontWeight="400" lineHeight="28px">
                  26547789
                </Text>
                <Text
                  color={theme.colors.green}
                  fontWeight="400"
                  lineHeight="20px"
                  fontSize="14px"
                />
              </Stack>
              <Text
                color={theme.colors.brown}
                fontWeight="400"
                lineHeight="20px"
                fontSize="14px"
              >
                VALIDATORS
              </Text>
            </Box>
          </GridItem>
        </Grid>
      </Box>
    </Center>
  );
};

export default BlockDetail;
