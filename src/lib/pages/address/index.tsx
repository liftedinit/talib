import {
  Box,
  Center,
  Grid,
  GridItem,
  Heading,
  Link,
  Text,
  Stack,
} from "@chakra-ui/react";

import AddressList from "lib/components/addresslist/AddressList";
import { theme } from "lib/styles/customTheme";

const Address = () => {
  return (
    <Box mt={{ sm: 2, md: 5 }}>
      <Center h={{ sm: "280px", md: "auto" }}>
        <Box>
          <Box
            display="flex"
            flexDirection="row"
            alignItems="baseline"
            px={{ sm: "20px", md: "0px" }}
          >
            <Heading fontSize="1.5rem" fontWeight={400} as="h3">
              ADDRESS
            </Heading>
            <Link
              color={theme.colors.green}
              textOverflow="ellipsis"
              noOfLines={1}
              fontSize={{ sm: ".9rem", md: "1.1rem" }}
              mx={2}
              w={{ sm: "10em", md: "100%" }}
            >
              0xB8c77482e45F1F44dE1745F52C74426C631bDD52
            </Link>
          </Box>
          <Grid
            h={{ sm: "250px", md: "123px" }}
            w={{ sm: "23em", md: "48em", lg: "72em" }}
            maxW="full"
            // eslint-disable-next-line sonarjs/no-duplicate-string
            gridTemplateColumns={{ sm: "repeat(1, 1fr)", md: "repeat(2, 1fr)" }}
            templateRows={{ sm: "repeat(2, 1fr)", md: "repeat(7, 1fr)" }}
            gap={2}
            alignItems={{ sm: "start", md: "center" }}
            paddingTop={{ sm: "10px", md: "0px" }}
            mt="5px"
            px={{ sm: "20px", md: "0px" }}
          >
            <GridItem
              w="100%"
              h={{ sm: "100px", md: "100px" }}
              bg={theme.colors.white}
              borderRadius="md"
            >
              <Grid
                templateColumns={{ sm: "repeat(1, 1fr)", md: "repeat(3, 1fr)" }}
                gap={0}
                height="100%"
              >
                <GridItem
                  colSpan={{ sm: 2, md: 2 }}
                  h="auto"
                  py={2}
                  px={{ sm: 2, md: 5 }}
                >
                  <Stack display="flex" flexDirection="row" alignItems="center">
                    <Text fontSize="22px" fontWeight="400" lineHeight="28.44px">
                      $442.86
                    </Text>
                    <Text
                      fontWeight="400"
                      lineHeight="20px"
                      fontSize="16px"
                      color={theme.colors.green}
                    >
                      (+1.87%)
                    </Text>
                  </Stack>
                  <Stack display="flex" flexDirection="row" alignItems="center">
                    <Text
                      fontSize="16px"
                      fontWeight="400"
                      lineHeight="28.44px"
                      color={theme.colors.brown}
                    >
                      BALANCE
                    </Text>
                  </Stack>
                </GridItem>
              </Grid>
            </GridItem>
          </Grid>
        </Box>
      </Center>
      <AddressList />
    </Box>
  );
};

export default Address;
