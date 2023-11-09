import { Heading, SimpleGrid, Center} from "@liftedinit/ui";
import { MapChart } from "ui";
import { NetworkMetrics } from "./networkMetrics";

export function Metrics() {
  return (
    <>
      <Center my={12}>
      <Heading fontWeight="light">
        Metrics for the <b>Manifest</b> network
      </Heading>
    </Center>
    <NetworkMetrics />
    <Center mt={12}>
      <Heading fontWeight="light">
        Nodes on the <b>Manifest</b> network
      </Heading>
    </Center>
    <SimpleGrid gap="3" mt={2}>
      <MapChart />
    </SimpleGrid>
    </>
  );
}
