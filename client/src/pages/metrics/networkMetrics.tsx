import { Box, Heading, SimpleGrid } from "@liftedinit/ui";
import { MetricChart, MetricStat } from "ui";
import { convertBytesToMb, convertBytesToGb, convertKbToTb, convertGbToTb, convertTbToPb } from "utils";

export function NetworkMetrics() {

  return (
    <>
      <Heading as='h4' size='md' py="5" pl="5" >Network Totals</Heading>
      <SimpleGrid columns={3} gap="6" mt={2}>
        <MetricStat label="Total Nodes" metric="nodecount" from={"now-1d"} to={"now"} maxDataPoints={50} />
        <MetricStat label="Total CPU Cores" metric="cpucores" from={"now-1d"} to={"now"} maxDataPoints={50} />
        <MetricStat label="Total Blocks Produced" metric="totalblocks" from={"now-1d"} to={"now"} maxDataPoints={50} />
      </SimpleGrid>
      <Heading as='h4' size='md' py="5" pl="5" >Disk</Heading>
      <SimpleGrid columns={3} gap="6" mt={2}>
        <Box backgroundColor="transparent">
          <MetricStat label="Total Disk Space" metric="totaldiskspace" from={"now-1d"} to={"now"} conversion={convertGbToTb} maxDataPoints={50} fixedDecimals={5} unit="TB" />
          <MetricChart label="Total Disk Space" type="area" metric="totaldiskspace" conversion={convertGbToTb} from={"now-14d"} to={"now"} fixedDecimals={2} intervalMs={15000} maxDataPoints={250} ytitle="TB" />
        </Box>
        <Box backgroundColor="transparent">
          <MetricStat label="Free Disk Space" metric="freediskspace" conversion={convertGbToTb} from={"now-1d"} to={"now"} maxDataPoints={50} fixedDecimals={5} unit="TB" />
          <MetricChart label="Free Disk Space" type="area" metric="freediskspace" conversion={convertGbToTb} from={"now-14d"} to={"now"} fixedDecimals={2} intervalMs={15000} maxDataPoints={250} ytitle="TB" />
        </Box>
        <Box backgroundColor="transparent">
          <MetricStat label="Used Disk Space" metric="useddiskspace" conversion={convertGbToTb} from={"now-1d"} to={"now"} maxDataPoints={50} fixedDecimals={5} unit="TB" />
          <MetricChart label="Used Disk Space" type="area" metric="useddiskspace" conversion={convertGbToTb} from={"now-14d"} to={"now"} fixedDecimals={2} intervalMs={15000} maxDataPoints={250} ytitle="TB" />
        </Box>
      </SimpleGrid>
      <Heading as='h4' size='md' py="5" pl="5" >RAM</Heading>
      <SimpleGrid columns={3} gap="6" mt={2}>
        <Box backgroundColor="transparent">
          <MetricStat label="Total Memory" metric="totalmemory" conversion={convertKbToTb} from={"now-1d"} to={"now"} maxDataPoints={50} fixedDecimals={5} unit="TB" />
          <MetricChart label="Total Memory" type="area" metric="totalmemory" conversion={convertKbToTb} from={"now-14d"} to={"now"} fixedDecimals={2} intervalMs={15000} maxDataPoints={250} ytitle="TB" />
        </Box>
        <Box backgroundColor="transparent">
          <MetricStat label="Free Memory" metric="freememory" conversion={convertKbToTb} from={"now-1d"} to={"now"} maxDataPoints={50} fixedDecimals={5} unit="TB" />
          <MetricChart label="Free Memory" type="area" metric="freememory" conversion={convertKbToTb} from={"now-14d"} to={"now"} fixedDecimals={2} intervalMs={15000} maxDataPoints={250} ytitle="TB" />
        </Box>
        <Box backgroundColor="transparent">
          <MetricStat label="Used Memory" metric="usedmemory" conversion={convertKbToTb} from={"now-1d"} to={"now"} maxDataPoints={50} fixedDecimals={5} unit="TB" />
          <MetricChart label="Used Memory" type="area" metric="usedmemory" conversion={convertKbToTb} from={"now-14d"} to={"now"} fixedDecimals={2} intervalMs={15000} maxDataPoints={250} ytitle="TB" />
        </Box>
      </SimpleGrid>
      <Heading as='h4' size='md' py="5" pl="5" >Object Storage</Heading>
      <SimpleGrid columns={3} gap="6" mt={2}>
        <Box backgroundColor="transparent">
          <MetricStat label="Total Objects" metric="totalobjects" from={"now-1d"} to={"now"} maxDataPoints={50} fixedDecimals={5} unit="Objects" />
          <MetricChart label="Total Objects" type="area" metric="totalobjects" from={"now-14d"} to={"now"} fixedDecimals={2} intervalMs={15000} maxDataPoints={250} ytitle="Objects" />
        </Box>
        <Box backgroundColor="transparent">
          <MetricStat label="Used Object Storage" metric="usedobjectstorage" conversion={convertBytesToMb} from={"now-1d"} to={"now"} maxDataPoints={50} fixedDecimals={5} unit="MB" />
          <MetricChart label="Used Object Storage" type="area" metric="usedobjectstorage" conversion={convertBytesToMb} from={"now-14d"} to={"now"} fixedDecimals={2} intervalMs={15000} maxDataPoints={250} ytitle="MB" />
        </Box>
        <Box backgroundColor="transparent">
          <MetricStat label="Total Buckets" metric="totalbuckets" from={"now-1d"} to={"now"} maxDataPoints={50} fixedDecimals={5} unit="Buckets" />
          <MetricChart label="Total Buckets" type="area" metric="totalbuckets" from={"now-14d"} to={"now"} fixedDecimals={2} intervalMs={15000} maxDataPoints={250} ytitle="Buckets" />
        </Box>
      </SimpleGrid>
    </>
  );
}
