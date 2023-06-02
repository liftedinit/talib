import { Box, Heading, Text, Center} from "@liftedinit/ui";
import { Link } from "react-router-dom";
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
    </>
  );
}
