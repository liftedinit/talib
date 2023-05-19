import { Spinner, Stack } from "@liftedinit/ui";
import { useQuery } from "@tanstack/react-query";

import { getManifestMetricCurrent, getManifestMetrics } from "api";
import { Stat } from "ui";

export function NetworkMetrics() {

  // Get a list of all stats
  const { data } = useQuery(["stats"], getManifestMetrics());

  const getNodeCount = useQuery(["nodecount"], getManifestMetricCurrent("nodecount")).data;
  const getCpuCores = useQuery(["cpucores"], getManifestMetricCurrent("cpucores")).data;
  const getTotalBlocks = useQuery(["totalblocks"], getManifestMetricCurrent("totalblocks")).data;
  const getFreeMemory = useQuery(["freememory"], getManifestMetricCurrent("freememory")).data;
  const getUsedMemory = useQuery(["usedmemory"], getManifestMetricCurrent("usedmemory")).data;

  let convertToGb = (b: number): number => {
    let gbValue = (b / (1000));
    return gbValue
  }

  let convertToPb = (b: number): number => {
    let gbValue = (b / (1000 * 1000));
    return gbValue
  }

  if (!data) {
    return <Spinner />;
  }

  return (   
    <>
      {data.isLoading ? (
        <Spinner />
      ) : (     
    <><Stack direction="row" mt={6}>
        <Stat label="Total Nodes" value={getNodeCount} />
        <Stat label="Total CPU Cores" value={getCpuCores} />
        <Stat label="Total Blocks Produced" value={parseInt(getTotalBlocks)} />
      </Stack>
      <Stack direction="row" mt={6}>
        <Stat label="Free Memory" value={Math.floor(convertToPb(getFreeMemory)) + " TB"} />
        <Stat label="Used Memory" value={Math.floor(convertToGb(getUsedMemory)) + " GB"} />
      </Stack></>
    )}
  </>
  );
}
