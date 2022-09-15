import {
  Box,
  Button,
  Center,
  Divider,
  Grid,
  GridItem,
  Heading,
  HStack,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Stack,
  Tag,
  TagLabel,
  TagLeftIcon,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { FaCheckCircle, FaChevronDown } from "react-icons/fa";
import { RiPlayLine } from "react-icons/ri";

import TransactionData from "../../../demodata/TransactionData";
import { theme } from "lib/styles/customTheme";

type Transaction = {
  transaction_hash: string;
};

interface Props {
  transaction_hash: Transaction[];
}
// eslint-disable-next-line
const TransactionDetail = ({ transaction_hash }: Props) => {
  // demo data remove after create the real method
  const transactionData = TransactionData;

  return (
    <Box my={5}>
      <Center h={{ sm: "681px", md: "auto" }}>
        <Box>
          <Box display="flex" flexFlow="row" alignItems="baseline">
            <Heading fontSize="32px" fontWeight={400} as="h3">
              TRANSACTION DETAIL
            </Heading>
          </Box>
          <Grid
            h={{ sm: "650px", md: "503px" }}
            w={{ sm: "23em", md: "48em", lg: "72em" }}
            maxW="full"
            templateColumns="repeat(1, 1fr)"
            templateRows={{ sm: "repeat(7, 1fr)", md: "repeat(7, 1fr)" }}
            gap={0}
            bg={theme.colors.white}
            borderRadius="md"
            alignItems={{ sm: "start", md: "center" }}
            paddingTop={{ sm: "30px", md: "0px" }}
            mt="5px"
            px={{ sm: "25px", md: "25px" }}
          >
            <GridItem w="100%" h="auto">
              <Box
                height="38px"
                display="flex"
                flexDirection="column"
                justifyContent="center"
                paddingLeft={{ sm: "0px", md: "0px" }}
                alignItems={{ sm: "start", md: "start" }}
              >
                <Stack display="flex" flexDirection="row" alignItems="center">
                  <Text
                    fontSize={{ sm: "1.5rem", md: "1.3rem" }}
                    fontWeight="400"
                    lineHeight="28px"
                  >
                    OVERVIEW
                  </Text>
                </Stack>
                <Divider orientation="horizontal" />
              </Box>
            </GridItem>
            <GridItem w="100%" h="auto">
              <Grid
                // eslint-disable-next-line sonarjs/no-duplicate-string
                templateColumns={{ sm: "repeat(6, 1fr)", md: "repeat(4, 1fr)" }}
                my={3}
                gap={0}
              >
                <GridItem
                  colSpan={{ sm: 2, md: 1 }}
                  h="10"
                  fontSize={{ sm: ".9rem", md: "1.1rem" }}
                >
                  <Text>TSX HASH</Text>
                </GridItem>
                <GridItem colSpan={{ sm: 4, md: 3 }} h="10">
                  <Link
                    color={theme.colors.green}
                    textOverflow="ellipsis"
                    noOfLines={1}
                    fontSize={{ sm: ".9rem", md: "1.1rem" }}
                  >
                    {transactionData[0].transaction_hash}
                  </Link>
                </GridItem>
                <GridItem
                  colSpan={{ sm: 2, md: 1 }}
                  h="10"
                  fontSize={{ sm: ".9rem", md: "1.1rem" }}
                >
                  <Text>TIME</Text>
                </GridItem>
                <GridItem
                  colSpan={{ sm: 4, md: 3 }}
                  h="10"
                  fontSize={{ sm: ".9rem", md: "1.1rem" }}
                >
                  <Text>{transactionData[0].time}</Text>
                </GridItem>
                <GridItem
                  colSpan={{ sm: 2, md: 1 }}
                  h="10"
                  fontSize={{ sm: ".9rem", md: "1.1rem" }}
                  mt={{ sm: "10px", md: "0px" }}
                >
                  <Text>STATUS</Text>
                </GridItem>
                <GridItem
                  colSpan={{ sm: 4, md: 3 }}
                  h="10"
                  mt={{ sm: "10px", md: "0px" }}
                >
                  <HStack spacing={4}>
                    <Tag
                      size="md"
                      key="md"
                      variant="subtle"
                      bgColor={theme.colors.green}
                      color={theme.colors.white}
                    >
                      <TagLeftIcon boxSize="12px" as={FaCheckCircle} />
                      <TagLabel>{transactionData[0].status}</TagLabel>
                    </Tag>
                  </HStack>
                </GridItem>
              </Grid>
              <Divider orientation="horizontal" />
            </GridItem>
            <GridItem w="100%" h="auto">
              <Grid
                templateColumns={{ sm: "repeat(6, 1fr)", md: "repeat(4, 1fr)" }}
                my={3}
                gap={0}
              >
                <GridItem
                  colSpan={{ sm: 2, md: 1 }}
                  h="10"
                  fontSize={{ sm: ".9rem", md: "1.1rem" }}
                >
                  <Text>TO</Text>
                </GridItem>
                <GridItem colSpan={{ sm: 4, md: 3 }} h="10">
                  <Link
                    color={theme.colors.green}
                    textOverflow="ellipsis"
                    noOfLines={1}
                    fontSize={{ sm: ".9rem", md: "1.1rem" }}
                  >
                    {transactionData[0].from_address}
                  </Link>
                </GridItem>
                <GridItem
                  colSpan={{ sm: 2, md: 1 }}
                  h="10"
                  fontSize={{ sm: ".9rem", md: "1.1rem" }}
                >
                  <Text>FROM</Text>
                </GridItem>
                <GridItem colSpan={{ sm: 4, md: 3 }} h="10">
                  <Link
                    color={theme.colors.green}
                    textOverflow="ellipsis"
                    noOfLines={1}
                    fontSize={{ sm: ".9rem", md: "1.1rem" }}
                  >
                    {transactionData[0].to_address}
                  </Link>
                </GridItem>
              </Grid>
              <Divider orientation="horizontal" />
            </GridItem>
            <GridItem w="100%" h="auto" gap={0}>
              <Grid
                templateColumns={{ sm: "repeat(6, 1fr)", md: "repeat(4, 1fr)" }}
                my={3}
                gap={0}
              >
                <GridItem
                  h="auto"
                  colSpan={{ sm: 2, md: 1 }}
                  fontSize={{ sm: ".9rem", md: "1.1rem" }}
                >
                  <Text>TRANSACTION FEE</Text>
                </GridItem>
                <GridItem
                  colSpan={{ sm: 4, md: 3 }}
                  h="auto"
                  fontSize={{ sm: ".9rem", md: "1.1rem" }}
                >
                  <Text>{transactionData[0].transaction_fee}</Text>
                </GridItem>
              </Grid>
              <Divider orientation="horizontal" />
            </GridItem>
            <GridItem w="100%" h="auto" gap={0}>
              <Grid
                templateColumns={{ sm: "repeat(6, 1fr)", md: "repeat(4, 1fr)" }}
                my={3}
                gap={0}
              >
                <GridItem colSpan={{ sm: 6, md: 1 }} h="auto">
                  <Text>INPUT DATA</Text>
                </GridItem>
                <GridItem colSpan={{ sm: 6, md: 3 }} h="auto">
                  <Textarea
                    value={transactionData[0].input_data}
                    isReadOnly
                    fontWeight={400}
                    fontSize="14px"
                    lineHeight="20px"
                    color={theme.colors.black}
                    bg={theme.colors.grey}
                    placeholder="Here is a sample placeholder"
                    resize="none"
                    _active={{ bg: theme.colors.grey, borderColor: "none" }}
                    _focusVisible={{
                      bg: theme.colors.grey,
                      borderColor: "none",
                    }}
                  />
                </GridItem>
                <GridItem colSpan={{ sm: 0, md: 1 }} h="auto" />
                <GridItem colSpan={{ sm: 6, md: 3 }} h="auto" mt={3}>
                  <Menu>
                    <MenuButton
                      as={Button}
                      rightIcon={<FaChevronDown />}
                      w={{ sm: "100%", md: "auto" }}
                      bg={theme.colors.aquamarine}
                      _hover={{
                        bg: theme.colors.aquamarine,
                        borderColor: "none",
                      }}
                      _active={{
                        bg: theme.colors.aquamarine,
                        borderColor: "none",
                      }}
                    >
                      View Input As
                    </MenuButton>
                    <MenuList bg={theme.colors.aquamarine}>
                      <MenuItem
                        bg={theme.colors.aquamarine}
                        color={theme.colors.white}
                        _hover={{
                          bg: theme.colors.aquamarine,
                          borderColor: "none",
                        }}
                        _active={{
                          bg: theme.colors.aquamarine,
                          borderColor: "none",
                        }}
                        _focus={{
                          bg: theme.colors.aquamarine,
                          borderColor: "none",
                        }}
                      >
                        Option One
                      </MenuItem>
                      <MenuItem
                        bg={theme.colors.aquamarine}
                        color={theme.colors.white}
                        _hover={{
                          bg: theme.colors.aquamarine,
                          borderColor: "none",
                        }}
                        _active={{
                          bg: theme.colors.aquamarine,
                          borderColor: "none",
                        }}
                        _focus={{
                          bg: theme.colors.aquamarine,
                          borderColor: "none",
                        }}
                      >
                        Option Two
                      </MenuItem>
                    </MenuList>
                  </Menu>
                  <Button
                    leftIcon={<RiPlayLine size="29px" />}
                    color={theme.colors.white}
                    bg={theme.colors.aquamarine}
                    _hover={{
                      bg: theme.colors.aquamarine,
                      borderColor: "none",
                    }}
                    w={{ sm: "100%", md: "auto" }}
                    size="md"
                    ml={{ sm: 0, md: 4 }}
                    mt={{ sm: 4, md: 0 }}
                  >
                    Decode Input Data
                  </Button>
                </GridItem>
              </Grid>
            </GridItem>
          </Grid>
        </Box>
      </Center>
    </Box>
  );
};

export default TransactionDetail;
