import { Box, Heading, SimpleGrid } from "@liftedinit/ui";
import { MetricChart, MetricStat } from "ui";
import { convertBytesToMb, convertKbToGb, convertKbToTb, convertGbToTb, convertNumToBil } from "utils";

export function NetworkMetrics() {

  return (
    <>
      <Heading as='h4' size='md' py="5" pl="5" >Blockchain Network Totals</Heading>
      <SimpleGrid columns={{ base: 1, sm: 1, md: 2, lg: 3 }} gap="6" mt={2}>
        <Box backgroundColor="transparent">
          <MetricStat label="Total Blocks Produced" metric="totalblocks" systemwide />
        </Box>
        <Box backgroundColor="transparent">
          <MetricStat label="Total Transactions" metric="totaltransactions" systemwide/>
        </Box>
        <Box backgroundColor="transparent">
          <MetricStat label="Total Tokens" metric="totaltokens" from={"now-1d"} to={"now"} />
        </Box>
      </SimpleGrid>
      <Heading as='h4' size='md' py="5" pl="5" >Nodes</Heading>
      <SimpleGrid columns={{ base: 1, sm: 1, md: 2, lg: 3 }} gap="6" mt={2}>
        <Box backgroundColor="transparent">
          <MetricStat label="Total Nodes" metric="nodecount" from={"now-1d"} to={"now"} />
          <MetricChart label="Total Nodes" type="area" metric="nodecount" from={"now-60d"} to={"now"} fixedDecimals={0} ytitle="Nodes" />
        </Box>
        <Box backgroundColor="transparent">
          <MetricStat label="Total CPU Cores" metric="cpucores" from={"now-1d"} to={"now"} />
          <MetricChart label="Total CPU Cores" type="area" metric="cpucores" from={"now-60d"} to={"now"} fixedDecimals={0} ytitle="Cores" />
        </Box>
        <Box backgroundColor="transparent">
          <MetricStat label="Total Processes" metric="totalprocesses" from={"now-1d"} to={"now"} />
          <MetricChart label="Total Processes" type="area" metric="totalprocesses" from={"now-60d"} to={"now"} fixedDecimals={0} ytitle="Processes" />
        </Box>
      </SimpleGrid>
      <Heading as='h4' size='md' py="5" pl="5" >Web Services</Heading>
      <SimpleGrid columns={{ base: 1, sm: 1, md: 2, lg: 3 }} gap="6" mt={2}>
        <Box backgroundColor="transparent">
          <MetricStat label="Web Requests / Sec" metric="nginxrequestssec" from={"now-1d"} to={"now"} />
          <MetricChart label="Web Requests / Sec" type="area" metric="nginxrequestssec" from={"now-60d"} to={"now"} fixedDecimals={0} ytitle="Requests / Sec" />
        </Box>
        <Box backgroundColor="transparent">
          <MetricStat label="Total Web Servers" metric="totalwebservers" from={"now-1d"} to={"now"} />
          <MetricChart label="Total Web Servers" type="area" metric="totalwebservers" from={"now-60d"} to={"now"} fixedDecimals={0} ytitle="Servers" />
        </Box>
        <Box backgroundColor="transparent">
          <MetricStat label="Total Web Requests" metric="totalnginxrequests" transform="sumtotal" from={"now-1d"} to={"now"} />
          <MetricChart label="Total Web Requests" type="area" metric="totalnginxrequests" transform="sumtotal" from={"now-60d"} to={"now"} fixedDecimals={0} ytitle="Requests" />
        </Box>
      </SimpleGrid>
      <Heading as='h4' size='md' py="5" pl="5" >Disk</Heading>
      <SimpleGrid columns={{ base: 1, sm: 1, md: 2, lg: 3 }} gap="6" mt={2}>
        <Box backgroundColor="transparent">
          <MetricStat label="Total Disk Space" metric="totaldiskspace" from={"now-1d"} to={"now"} conversion={convertGbToTb} fixedDecimals={5} unit="TB" />
          <MetricChart label="Total Disk Space" type="area" metric="totaldiskspace" conversion={convertGbToTb} from={"now-60d"} to={"now"} fixedDecimals={2} ytitle="TB" />
        </Box>
        <Box backgroundColor="transparent">
          <MetricStat label="Free Disk Space" metric="freediskspace" conversion={convertGbToTb} from={"now-1d"} to={"now"} fixedDecimals={5} unit="TB" />
          <MetricChart label="Free Disk Space" type="area" metric="freediskspace" conversion={convertGbToTb} from={"now-60d"} to={"now"} fixedDecimals={2} ytitle="TB" />
        </Box>
        <Box backgroundColor="transparent">
          <MetricStat label="Used Disk Space" metric="useddiskspace" conversion={convertGbToTb} from={"now-1d"} to={"now"} fixedDecimals={5} unit="TB" />
          <MetricChart label="Used Disk Space" type="area" metric="useddiskspace" conversion={convertGbToTb} from={"now-60d"} to={"now"} fixedDecimals={2} ytitle="TB" />
        </Box>
      </SimpleGrid>
      <Heading as='h4' size='md' py="5" pl="5" >RAM</Heading>
      <SimpleGrid columns={{ base: 1, sm: 1, md: 2, lg: 3 }} gap="6" mt={2}>
        <Box backgroundColor="transparent">
          <MetricStat label="Total Memory" metric="totalmemory" conversion={convertKbToGb} from={"now-1d"} to={"now"} fixedDecimals={5} unit="TB" />
          <MetricChart label="Total Memory" type="area" metric="totalmemory" conversion={convertKbToGb} from={"now-60d"} to={"now"} fixedDecimals={2} ytitle="TB" />
        </Box>
        <Box backgroundColor="transparent">
          <MetricStat label="Free Memory" metric="freememory" conversion={convertKbToGb} from={"now-1d"} to={"now"} fixedDecimals={5} unit="TB" />
          <MetricChart label="Free Memory" type="area" metric="freememory" conversion={convertKbToGb} from={"now-60d"} to={"now"} fixedDecimals={2} ytitle="TB" />
        </Box>
        <Box backgroundColor="transparent">
          <MetricStat label="Used Memory" metric="usedmemory" conversion={convertKbToGb} from={"now-1d"} to={"now"} fixedDecimals={5} unit="TB" />
          <MetricChart label="Used Memory" type="area" metric="usedmemory" conversion={convertKbToGb} from={"now-60d"} to={"now"} fixedDecimals={2} ytitle="TB" />
        </Box>
      </SimpleGrid>
      <Heading as='h4' size='md' py="5" pl="5" >Network</Heading>
      <SimpleGrid columns={{ base: 1, sm: 1, md: 2, lg: 4 }} gap="6" mt={2}>
        <Box backgroundColor="transparent">
          <MetricStat label="Total IPv4 Bandwidth Sent" metric="ipv4bandwidthsent" transform="sumtotal" conversion={convertKbToTb} from={"now-1d"} to={"now"} fixedDecimals={5} unit="TB" />
          <MetricChart label="Total IPv4 Bandwidth Sent" type="area" metric="ipv4bandwidthsent" transform="sumtotal" conversion={convertKbToTb} from={"now-60d"} to={"now"} fixedDecimals={2} ytitle="TB" />
        </Box>
        <Box backgroundColor="transparent">
          <MetricStat label="Total IPv4 Bandwidth Received" metric="ipv4bandwidthreceived" transform="sumtotal" conversion={convertKbToTb} from={"now-1d"} to={"now"} fixedDecimals={5} unit="TB" />
          <MetricChart label="Total IPv4 Bandwidth Received" type="area" metric="ipv4bandwidthreceived" transform="sumtotal" conversion={convertKbToTb} from={"now-60d"} to={"now"} fixedDecimals={2} ytitle="TB" />
        </Box>
        <Box backgroundColor="transparent">
          <MetricStat label="Total Ipv4 Packets Sent" metric="ipv4packetssent" transform="sumtotal" conversion={convertNumToBil} from={"now-1d"} to={"now"} fixedDecimals={5} unit="Packets" />
          <MetricChart label="Total IPv4 Packets Sent" type="area" metric="ipv4packetssent" transform="sumtotal" conversion={convertNumToBil} from={"now-60d"} to={"now"} fixedDecimals={2} ytitle="Billion" />
        </Box>
        <Box backgroundColor="transparent">
          <MetricStat label="Total Ipv4 Packets Received" metric="ipv4packetsreceived" transform="sumtotal" conversion={convertNumToBil} from={"now-1d"} to={"now"} fixedDecimals={5} unit="Packets" />
          <MetricChart label="Total IPv4 Packets Received" type="area" metric="ipv4packetsreceived" transform="sumtotal" conversion={convertNumToBil} from={"now-60d"} to={"now"} fixedDecimals={2} ytitle="Billion" />
        </Box>
      </SimpleGrid>
      <Heading as='h4' size='md' py="5" pl="5" >Object Storage</Heading>
      <SimpleGrid columns={{ base: 1, sm: 1, md: 2, lg: 3 }} gap="6" mt={2}>
        <Box backgroundColor="transparent">
          <MetricStat label="Total Objects" metric="totalobjects" from={"now-1d"} to={"now"} fixedDecimals={5} unit="Objects" />
          <MetricChart label="Total Objects" type="area" metric="totalobjects" from={"now-60d"} to={"now"} fixedDecimals={2}  ytitle="Objects" />
        </Box>
        <Box backgroundColor="transparent">
          <MetricStat label="Used Object Storage" metric="usedobjectstorage" conversion={convertBytesToMb} from={"now-1d"} to={"now"} fixedDecimals={5} unit="MB" />
          <MetricChart label="Used Object Storage" type="area" metric="usedobjectstorage" conversion={convertBytesToMb} from={"now-60d"} to={"now"} fixedDecimals={2}  ytitle="MB" />
        </Box>
        <Box backgroundColor="transparent">
          <MetricStat label="Total Buckets" metric="totalbuckets" from={"now-1d"} to={"now"} fixedDecimals={5} unit="Buckets" />
          <MetricChart label="Total Buckets" type="area" metric="totalbuckets" from={"now-60d"} to={"now"} fixedDecimals={2}  ytitle="Buckets" />
        </Box>
      </SimpleGrid>
    </>
  );
}
