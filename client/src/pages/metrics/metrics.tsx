import { Box, Heading, SimpleGrid, Center, Grid, GridItem } from "@liftedinit/ui";
import { MapChart, MetricNav } from "ui";
import { NetworkMetrics } from "./networkMetrics";
import { MdMemory, MdStorage, MdDns} from "react-icons/md";
import { FaHive, FaNetworkWired, FaFile, FaServer, FaGhost } from "react-icons/fa6"

const navItems = [
  { label: "Neighborhoods", section: "blockchain", icon: FaHive },
  { label: "Nodes", section: "nodes", icon: FaServer },
  { label: "Web", section: "web", icon: MdDns },
  { label: "Hosting", section: "hosting", icon: FaGhost },
  { label: "Storage", section: "storage", icon: MdStorage },
  { label: "Memory", section: "memory", icon: MdMemory },
  { label: "Network", section: "network", icon: FaNetworkWired },
  { label: "Object Storage", section: "object-storage", icon: FaFile },
  // { label: "AI", section: "ai", icon: MdRobot },
];

export function Metrics() {
  return (
    <>
    <Grid gap={3}>
        <Center mt={12}>
          <Heading fontWeight="light">
            Nodes on the <b>Manifest</b> network
          </Heading>
        </Center>
      <GridItem>
        <SimpleGrid gap="3" mt={2} id="map">
          <MapChart />
        </SimpleGrid>
      </GridItem>
    </Grid>
    <Grid gap={3} templateColumns={{base: "1fr", md: "12rem 1fr"}} >
      <GridItem>
        <Box>
          <MetricNav navItems={navItems} />
        </Box>
      </GridItem>
      <GridItem>
        <NetworkMetrics />
      </GridItem>
    </Grid>
  </>
  );
}


