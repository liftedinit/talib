import { Spinner, Stack } from "@liftedinit/ui";
import { useQuery } from "@tanstack/react-query";

import { getManifestMetricCurrent } from "api";
import { Stat } from "ui";

export function NetworkMetrics() {

  const getNodeCount = useQuery(["nodecount"], getManifestMetricCurrent("nodecount"));
  const nodeCount = getNodeCount.data;
  console.log("Node Count:" + nodeCount)


  return (   
    <>
      {getNodeCount.isLoading ? (
        <Spinner />
      ) : (     
    <Stack direction="row" mt={6}>
        <Stat label="Nodes" value={nodeCount} />
    </Stack>
    )}
  </>
  );
}
