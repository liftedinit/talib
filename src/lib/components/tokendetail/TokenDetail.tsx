import {
  Box,
  Center,
  Grid,
  GridItem,
  Heading,
  Link,
  Stack,
  Text,
} from "@chakra-ui/react";

import { theme } from "lib/styles/customTheme";

const TokenDetail = () => {
  return (
    <Center h={{ sm: "381px", md: "200px" }}>
      <Box>
        <Box display="flex" flexFlow="row" alignItems="baseline">
          <Heading fontSize="32px" fontWeight={400} as="h3">
            Token
          </Heading>
          <Text ml="3" fontWeight="400" lineHeight="24px" fontSize="16px">
            BNB
          </Text>
        </Box>
        <Grid
          h={{ sm: "310px", md: "140px" }}
          w={{ sm: "23em", md: "48em", lg: "72em" }}
          maxW="full"
          templateColumns={{ sm: "repeat(1, 1fr)", md: "repeat(4, 1fr)" }}
          gap={2}
          bg={theme.colors.white}
          borderRadius="md"
          alignItems={{ sm: "start", md: "center" }}
          paddingTop={{ sm: "30px", md: "0px" }}
          mt="10px"
          paddingLeft={{ sm: "0px", md: "25px" }}
        >
          <GridItem w="100%" h="78px" colSpan={2}>
            <Box
              height="78px"
              display="flex"
              flexDirection="column"
              justifyContent="center"
              paddingLeft={{ sm: "25px", md: "0px" }}
              alignItems={{ sm: "start", md: "start" }}
            >
              <Stack display="flex" flexDirection="row" alignItems="center">
                <Text fontSize="24px" fontWeight="400" lineHeight="28px">
                  18,562,881.00
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
                SUPPLY
              </Text>
            </Box>
          </GridItem>
          <GridItem w="100%" h="78px" colSpan={2}>
            <Box
              height="78px"
              display="flex"
              flexDirection="column"
              justifyContent="center"
              paddingLeft={{ sm: "25px", md: "0px" }}
              alignItems={{ sm: "start", md: "start" }}
            >
              <Stack display="flex" flexDirection="row" alignItems="center">
                <Text fontSize="22px" fontWeight="400" lineHeight="28.44px">
                  322,269
                </Text>
                <Text
                  fontWeight="400"
                  lineHeight="20px"
                  fontSize="14px"
                  color={theme.colors.green}
                >
                  #328277
                </Text>
              </Stack>
              <Text
                color={theme.colors.brown}
                fontWeight="400"
                lineHeight="20px"
                fontSize="14px"
              >
                UNIQUE HOLDERS
              </Text>
            </Box>
          </GridItem>
          <GridItem w="100%" h="35px" colSpan={2}>
            <Grid
              display="flex"
              flexDirection="row"
              justifyContent="start"
              alignItems="center"
              w="100%"
              gap={2}
              paddingLeft={{ sm: "25px", md: "0px" }}
            >
              <Text
                color={theme.colors.brown}
                fontWeight="400"
                lineHeight="20px"
                fontSize="14px"
              >
                CONTRACT
              </Text>
              <Link
                color={theme.colors.green}
                fontWeight="400"
                lineHeight="20px"
                fontSize="14px"
              >
                dasdasdasdad
              </Link>
            </Grid>
          </GridItem>
          <GridItem w="100%" h="35px" colSpan={2}>
            <Grid
              display="flex"
              flexDirection="row"
              justifyContent="start"
              alignItems="center"
              w="100%"
              gap={2}
              paddingLeft={{ sm: "25px", md: "0px" }}
            >
              <Text
                color={theme.colors.brown}
                fontWeight="400"
                lineHeight="20px"
                fontSize="14px"
              >
                WEBSITE
              </Text>
              <Link
                color={theme.colors.green}
                fontWeight="400"
                lineHeight="20px"
                fontSize="14px"
              >
                www.binance.com
              </Link>
            </Grid>
          </GridItem>
        </Grid>
      </Box>
    </Center>
  );
};

export default TokenDetail;
