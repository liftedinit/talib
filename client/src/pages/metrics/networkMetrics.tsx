import { Spinner, Stack } from "@liftedinit/ui";
import { useQuery } from "@tanstack/react-query";

import { getManifestMetricCurrent, getManifestMetrics } from "api";
import { Stat } from "ui";

export function NetworkMetrics() {

  // Get a list of all stats
  const getNodeCountQuery = useQuery(["nodecount"], getManifestMetricCurrent("nodecount"));
  const getCpuCoresQuery = useQuery(["cpucores"], getManifestMetricCurrent("cpucores"));
  const getTotalBlocksQuery = useQuery(["totalblocks"], getManifestMetricCurrent("totalblocks"));
  const getFreeMemoryQuery = useQuery(["freememory"], getManifestMetricCurrent("freememory"));
  const getUsedMemoryQuery = useQuery(["usedmemory"], getManifestMetricCurrent("usedmemory"));
  const getFreeDiskSpaceQuery = useQuery(["freediskspace"], getManifestMetricCurrent("freediskspace"));
  const getUsedDiskSpaceQuery = useQuery(["useddiskspace"], getManifestMetricCurrent("useddiskspace"));
  const getTotalDiskSpaceQuery = useQuery(["totaldiskspace"], getManifestMetricCurrent("totaldiskspace"));

  const getNodeCount = getNodeCountQuery.data;
  const getCpuCores = getCpuCoresQuery.data;
  const getTotalBlocks = getTotalBlocksQuery.data;
  const getFreeMemory = getFreeMemoryQuery.data;
  const getUsedMemory = getUsedMemoryQuery.data;
  const getFreeDiskSpace = getFreeDiskSpaceQuery.data;
  const getUsedDiskSpace = getUsedDiskSpaceQuery.data; 
  const getTotalDiskSpace = getTotalDiskSpaceQuery.data; 


  let convertMemToGb = (b: number): number => {
    let gbValue = (b / (1000));
    return gbValue
  }

  let convertMemToTb = (b: number): number => {
    let gbValue = (b / (1000 * 1000));
    return gbValue
  }

  if ( getNodeCountQuery.isLoading || 
    getCpuCoresQuery.isLoading || 
    getTotalBlocksQuery.isLoading || 
    getFreeMemoryQuery.isLoading || 
    getUsedMemoryQuery.isLoading ||
    getFreeDiskSpaceQuery.isLoading ||
    getUsedDiskSpaceQuery.isLoading ||
    getTotalDiskSpaceQuery.isLoading )  {
    return <Spinner />;
  }

  return (
    <><Stack direction="row" mt={6}>
        <Stat label="Total Nodes" value={getNodeCount} />
        <Stat label="Total CPU Cores" value={getCpuCores} />
        <Stat label="Total Blocks Produced" value={parseInt(getTotalBlocks)} />
      </Stack>
      <Stack direction="row" mt={6}>
        <Stat label="Free Memory" value={Math.floor(convertMemToTb(getFreeMemory)) + " TB"} />
        <Stat label="Used Memory" value={Math.floor(convertMemToGb(getUsedMemory)) + " GB"} />
      </Stack>
      <Stack direction="row" mt={6}>
        <Stat label="Total Disk Space" value={Number(getTotalDiskSpace / 1000 / 1000).toFixed(5) + " PB"} />
        <Stat label="Free Disk Space" value={Number(getFreeDiskSpace / 1000).toFixed(2) + " TB"} />
        <Stat label="Used Disk Space" value={Number(getUsedDiskSpace / 1000).toFixed(2) + " TB"} />
      </Stack>
  </>
  );
}