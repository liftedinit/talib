import {
  Box,
  Center,
  Grid,
  GridItem,
  Image,
  SimpleGrid,
  Stack,
  Text,
} from "@chakra-ui/react";

import { theme } from "lib/styles/customTheme";

const BlockNetworkInformation = () => {
  return (
    <Center h={{ sm: "681px", md: "200px" }}>
      <Grid
        pos="absolute"
        top="300px"
        h={{ sm: "650px", md: "177px" }}
        w={{ sm: "23em", md: "48em", lg: "62em" }}
        maxW="full"
        templateColumns={{ sm: "repeat(1, 1fr)", md: "repeat(3, 1fr)" }}
        gap={2}
        bg={theme.colors.white}
        borderRadius="md"
        alignItems={{ sm: "start", md: "center" }}
        paddingTop={{ sm: "30px", md: "0px" }}
      >
        <GridItem
          colSpan={2}
          h={{ sm: "325px", md: "177px" }}
          alignItems="center"
        >
          <SimpleGrid
            columns={{ sm: 1, md: 2 }}
            borderBottom={{ sm: "none", md: "1px" }}
            borderColor={{ md: "gray.300" }}
            spacing={0}
            height={{ sm: "175", md: "88px" }}
            paddingLeft={{ sm: "0px", md: "25px" }}
          >
            <Box
              height="88px"
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems={{ sm: "center", md: "start" }}
            >
              <Stack display="flex" flexDirection="row" alignItems="center">
                <Text fontSize="24px" fontWeight="400" lineHeight="28px">
                  1,585.83 M
                </Text>
                <Text
                  color={theme.colors.green}
                  fontWeight="400"
                  lineHeight="20px"
                  fontSize="14px"
                >
                  (12.7 tps)
                </Text>
              </Stack>
              <Text
                color={theme.colors.brown}
                fontWeight="400"
                lineHeight="20px"
                fontSize="14px"
              >
                TRANSACTIONS PER SECOND
              </Text>
            </Box>
            <Box
              height="88px"
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems={{ sm: "center", md: "start" }}
            >
              <Stack display="flex" flexDirection="row" alignItems="center">
                <Text fontSize="24px" fontWeight="400" lineHeight="28px">
                  312345678
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
                BLOCK HEIGHT
              </Text>
            </Box>
          </SimpleGrid>
          <SimpleGrid
            spacing={0}
            height={{ sm: "175", md: "88px" }}
            columns={{ sm: 1, md: 2 }}
            paddingLeft="25px"
          >
            <Box
              height="88px"
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems={{ sm: "center", md: "start" }}
            >
              <Stack display="flex" flexDirection="row" alignItems="center">
                <Text fontSize="24px" fontWeight="400" lineHeight="28px">
                  312345678 GH/s
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
                HASH RATE
              </Text>
            </Box>
            <Box
              height="88px"
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems={{ sm: "center", md: "start" }}
            >
              <Stack display="flex" flexDirection="row" alignItems="center">
                <Text fontSize="24px" fontWeight="400" lineHeight="28px">
                  34243654
                </Text>
                <Text
                  color={theme.colors.green}
                  fontWeight="400"
                  lineHeight="20px"
                  fontSize="14px"
                >
                  132242143
                </Text>
              </Stack>
              <Text
                color={theme.colors.brown}
                fontWeight="400"
                lineHeight="20px"
                fontSize="14px"
              >
                COMPUTER POWER USED / AVAILABLE
              </Text>
            </Box>
          </SimpleGrid>
        </GridItem>
        <GridItem
          colSpan={1}
          rowSpan={2}
          borderLeft={{ sm: "none", md: "1px" }}
          borderColor={{ md: "gray.300" }}
          h={{ sm: "325px", md: "177px" }}
        >
          <SimpleGrid
            columns={{ sm: 1, md: 1 }}
            spacing={0}
            height={{ sm: "88px", md: "80px" }}
            paddingLeft={{ sm: "0px", md: "25px" }}
          >
            <Box
              height="88px"
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems={{ sm: "center", md: "start" }}
            >
              <Stack display="flex" flexDirection="row" alignItems="center">
                <Text fontSize="24px" fontWeight="400" lineHeight="28px">
                  123/124
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
                ACTIVE NODES
              </Text>
            </Box>
          </SimpleGrid>
          <SimpleGrid
            spacing={0}
            height={{ sm: "175", md: "88px" }}
            columns={{ sm: 1, md: 1 }}
            paddingLeft="25px"
          >
            <Box
              height={{ sm: "175", md: "88px" }}
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems={{ sm: "center", md: "start" }}
            >
              <Image objectFit="cover" src="/assets/map.png" alt="map" />
            </Box>
          </SimpleGrid>
        </GridItem>
      </Grid>
    </Center>
  );
};

export default BlockNetworkInformation;
