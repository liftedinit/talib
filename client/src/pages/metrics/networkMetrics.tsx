import { Container, Box, Heading, SimpleGrid, Spinner, Stack } from "@liftedinit/ui";
import { useQuery } from "@tanstack/react-query";
import { getManifestMetricCurrent, getManifestMetrics } from "api";
import { Stat } from "ui";
import { MetricChart, MetricStat } from "ui";
import { convertBytesToGb, convertBytesToTb, convertGbToTb, convertTbToPb } from "utils";

export function NetworkMetrics() {

  return (
    <>
      <SimpleGrid columns={3} gap="6" mt={2}>
        <MetricStat label="Total Nodes" metric="nodecount" />
        <MetricStat label="Total CPU Cores" metric="cpucores" />
        <MetricStat label="Total Blocks Produced" metric="totalblocks" />
      </SimpleGrid>
      <SimpleGrid columns={3} gap="6" mt={2}>
        <Box>
          <MetricStat label="Total Disk Space" metric="totaldiskspace" from={"now-1d"} to={"now"} conversion={convertGbToTb} maxDataPoints="50" fixedDecimals="5" unit="TB" />
          <MetricChart label="Total Disk Space" type="area" metric="totaldiskspace" conversion={convertGbToTb} from={"now-7d"} to={"now"} fixedDecimals="2" intervalMs="30000" maxDataPoints="500" ytitle="TB" />
        </Box>
        <Box>
          <MetricStat label="Free Disk Space" metric="freediskspace" conversion={convertBytesToGb} from={"now-1d"} to={"now"} maxDataPoints="50" fixedDecimals="5" unit="TB" />
          <MetricChart label="Free Disk Space" type="area" metric="freediskspace" conversion={convertGbToTb} from={"now-7d"} to={"now"} fixedDecimals="2" intervalMs="30000" maxDataPoints="500" ytitle="TB" />
        </Box>
        <Box>
          <MetricStat label="Used Disk Space" metric="useddiskspace" conversion={convertGbToTb} from={"now-1d"} to={"now"} maxDataPoints="50" fixedDecimals="5" unit="TB" />
          <MetricChart label="Used Disk Space" type="area" metric="useddiskspace" conversion={convertGbToTb} from={"now-7d"} to={"now"} fixedDecimals="2" intervalMs="30000" maxDataPoints="500" ytitle="TB" />
        </Box>
      </SimpleGrid>
      <SimpleGrid columns={3} gap="6" mt={2}>
        <Box>
          <MetricStat label="Total Memory" metric="totalmemory" conversion={convertBytesToTb} from={"now-1d"} to={"now"} maxDataPoints="50" fixedDecimals="5" unit="TB" />
          <MetricChart label="Total Memory" type="area" metric="totalmemory" conversion={convertBytesToTb} from={"now-7d"} to={"now"} fixedDecimals="2" intervalMs="30000" maxDataPoints="500" ytitle="TB" />
        </Box>
        <Box>
          <MetricStat label="Free Memory" metric="freememory" conversion={convertBytesToTb} from={"now-1d"} to={"now"} maxDataPoints="50" fixedDecimals="5" unit="TB" />
          <MetricChart label="Free Memory" type="area" metric="freememory" conversion={convertBytesToTb} from={"now-7d"} to={"now"} fixedDecimals="2" intervalMs="30000" maxDataPoints="500" ytitle="TB" />
        </Box>
        <Box>
          <MetricStat label="Used Memory" metric="usedmemory" conversion={convertBytesToTb} from={"now-1d"} to={"now"} maxDataPoints="50" fixedDecimals="5" unit="TB" />
          <MetricChart label="Used Memory" type="area" metric="usedmemory" conversion={convertBytesToTb} from={"now-7d"} to={"now"} fixedDecimals="2" intervalMs="30000" maxDataPoints="500" ytitle="TB" />
        </Box>
      </SimpleGrid>
    </>
  );
}
