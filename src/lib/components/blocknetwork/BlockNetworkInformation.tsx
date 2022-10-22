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
import { useEffect, useState } from "react";

// import type BlockInformation from "lib/types/blockInformation";
import Api from "lib/config/api";
import { theme } from "lib/styles/customTheme";

const BlockNetworkInformation = () => {
  // GET with fetch API
  const url = Api.blockinformation;
  const [TsxPerSec, setTsxPerSec] = useState(0);
  const [TsxTps, setTsxTps] = useState(0);
  const [BlockHeight, setBlockHeight] = useState(0);
  const [HashRate, setHashRate] = useState(0);
  const [ComputerPowerUsed, setComputerPowerUsed] = useState(0);
  const [ComputerPowerAvailable, setComputerPowerAvailable] = useState(0);
  const [ActiveNodes, setActiveNodes] = useState(0);
  const [TotalNodes, setTotalNodes] = useState(0);

  const getBlockchainInfo = async () => {
    try {
      const response = await fetch(url, {
        method: "GET",
        mode: "cors",
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      });
      const data = await response.json();
      setTsxPerSec(data.tsx_per_sec);
      setTsxTps(data.tsx_tps);
      setBlockHeight(data.block_height);
      setHashRate(data.hash_rate);
      setComputerPowerUsed(data.computer_power_used);
      setComputerPowerAvailable(data.computer_power_available);
      setActiveNodes(data.active_nodes);
      setTotalNodes(data.total_nodes);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(e);
    }
  };
  useEffect(() => {
    getBlockchainInfo();
  });

  return (
    <Center h={{ sm: "681px", md: "200px" }}>
      <Grid
        pos="absolute"
        top="300px"
        h={{ sm: "650px", md: "177px" }}
        w={{ sm: "23em", md: "48em", lg: "72em" }}
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
              paddingLeft={{ sm: "25px", md: "0px" }}
              alignItems={{ sm: "start", md: "start" }}
            >
              <Stack display="flex" flexDirection="row" alignItems="center">
                <Text fontSize="24px" fontWeight="400" lineHeight="28px">
                  {TsxPerSec}M
                </Text>
                <Text
                  color={theme.colors.green}
                  fontWeight="400"
                  lineHeight="20px"
                  fontSize="14px"
                >
                  ({TsxTps} tps)
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
              paddingLeft={{ sm: "25px", md: "0px" }}
              alignItems={{ sm: "start", md: "start" }}
            >
              <Stack display="flex" flexDirection="row" alignItems="center">
                <Text fontSize="24px" fontWeight="400" lineHeight="28px">
                  {BlockHeight}
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
            paddingLeft={{ sm: "0px", md: "25px" }}
          >
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
                  {HashRate} GH/s
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
              paddingLeft={{ sm: "25px", md: "0px" }}
              alignItems={{ sm: "start", md: "start" }}
            >
              <Stack display="flex" flexDirection="row" alignItems="center">
                <Text fontSize="24px" fontWeight="400" lineHeight="28px">
                  {ComputerPowerUsed}
                </Text>
                <Text
                  color={theme.colors.green}
                  fontWeight="400"
                  lineHeight="20px"
                  fontSize="14px"
                >
                  {ComputerPowerAvailable}
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
              paddingLeft={{ sm: "25px", md: "0px" }}
              alignItems={{ sm: "start", md: "start" }}
            >
              <Stack display="flex" flexDirection="row" alignItems="center">
                <Text fontSize="24px" fontWeight="400" lineHeight="28px">
                  {ActiveNodes}/{TotalNodes}
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
