import React from "react";
import { Box, Heading, SimpleGrid } from "@liftedinit/ui";
import { MemoizedMetricChart as MetricChart, MemoizedMetricStat as MetricStat } from "ui";
import { convertBytesToMb, convertBytesToGb, convertKbToGb, convertKbToTb, convertGbToTb, convertNumToBil } from "utils";

export function NetworkMetrics() {
  return (
    <>
      <Heading as='h4' size='md' py="5" pl="5" >Blockchain Network Totals</Heading>
      <SimpleGrid id="blockchain" columns={{ base: 1, sm: 1, md: 2, lg: 5 }} gap="6" mt={2}>
        <Box backgroundColor="transparent">
          <MetricStat label="Total Blocks Produced" metric="totalblocks" systemwide />
        </Box>
        <Box backgroundColor="transparent">
          <MetricStat label="MFX to Power Conversion" metric="mfxpowerconversion" fixedDecimals={2} />
        </Box>
        <Box backgroundColor="transparent">
          <MetricStat label="Total Transactions" metric="totaltransactions" systemwide />
        </Box>
        <Box backgroundColor="transparent">
          <MetricStat label="Total Addresses" metric="totaladdresses" systemwide />
        </Box>
        <Box backgroundColor="transparent">
          <MetricStat label="Total Tokens" metric="totaltokens" from={"now-1d"} to={"now"} />
        </Box>
      </SimpleGrid>
      <Heading as='h4' size='md' py="5" pl="5" >Nodes</Heading>
      <SimpleGrid id="nodes" columns={{ base: 1, sm: 1, md: 2, lg: 3 }} gap="6" mt={2}>
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
      <Heading as='h4' size='md' py="5" pl="5" >Kubernetes</Heading>
      <SimpleGrid id="kubernetes" columns={{ base: 1, sm: 1, md: 2, lg: 4 }} gap="6" mt={2}>
        <Box backgroundColor="transparent">
          <MetricStat label="Total K8s Nodes" metric="kubenodecount" from={"now-1d"} to={"now"} />
          <MetricChart label="Total K8s Nodes" type="area" metric="kubenodecount" from={"now-60d"} to={"now"} fixedDecimals={0} ytitle="Nodes" />
        </Box>
        <Box backgroundColor="transparent">
          <MetricStat label="Total K8s Pods" metric="kubepodcount" from={"now-1h"} to={"now"} />
          <MetricChart label="Total K8s Pods" type="area" metric="kubepodcount" from={"now-60d"} to={"now"} fixedDecimals={0} ytitle="Pods" />
        </Box>
        <Box backgroundColor="transparent">
          <MetricStat label="Total K8s CPU Cores" metric="totalkubecpus" from={"now-1d"} to={"now"} />
          <MetricChart label="Total K8s CPU Cores" type="area" metric="totalkubecpus" from={"now-60d"} to={"now"} fixedDecimals={0} ytitle="Cores" />
        </Box>
        <Box backgroundColor="transparent">
          <MetricStat label="Total K8s Memory" metric="totalkubememory" conversion={convertKbToGb} from={"now-1d"} to={"now"} fixedDecimals={5} unit="TB" />
          <MetricChart label="Total K8s Memory" type="area" metric="totalkubememory" conversion={convertKbToGb} from={"now-60d"} to={"now"} fixedDecimals={2} ytitle="TB" />
        </Box>
      </SimpleGrid>
      <Heading as='h4' size='md' py="5" pl="5" >Web Services</Heading>
      <SimpleGrid id="web" columns={{ base: 1, sm: 1, md: 2, lg: 3 }} gap="6" mt={2}>
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
      <Heading as='h4' size='md' py="5" pl="5" >Decentralized Website Hosting</Heading>
      <SimpleGrid id="hosting" columns={{ base: 1, sm: 1, md: 2, lg: 3 }} gap="6" mt={2}>
        <Box backgroundColor="transparent">
          <MetricStat label="Web Requests / Sec" metric="webrequestssec" from={"now-1d"} to={"now"} />
          <MetricChart label="Web Requests / Sec" type="area" metric="webrequestssec" from={"now-60d"} to={"now"} fixedDecimals={0} ytitle="Requests / Sec" />
        </Box>
        <Box backgroundColor="transparent">
          <MetricStat label="Total Sites" metric="totalsitecount" from={"now-1d"} to={"now"} />
          <MetricChart label="Total Sites" type="area" metric="totalsitecount" from={"now-60d"} to={"now"} fixedDecimals={0} ytitle="Sites" />
        </Box>
        <Box backgroundColor="transparent">
          <MetricStat label="Total Web Requests" metric="totalwebrequests" transform="sumtotal" from={"now-1d"} to={"now"} />
          <MetricChart label="Total Web Requests" type="area" metric="totalwebrequests" transform="sumtotal" from={"now-60d"} to={"now"} fixedDecimals={0} ytitle="Requests" />
        </Box>
      </SimpleGrid>
      <Heading as='h4' size='md' py="5" pl="5" >GPU</Heading>
      <SimpleGrid id="ai" columns={{ base: 1, sm: 1, md: 2, lg: 3 }} gap="6" mt={2}>
        <Box backgroundColor="transparent">
          <MetricStat label="Total GPUs" metric="totalgpus" from={"now-1d"} to={"now"} fixedDecimals={5} unit="GPUs" />
          <MetricChart label="Total GPUs" type="area" metric="totalgpus" from={"now-60d"} to={"now"} fixedDecimals={2}  ytitle="GPUs" />
        </Box>
        <Box backgroundColor="transparent">
          <MetricStat label="Total Nvidia GPUs" metric="totalnvidiagpus" from={"now-1d"} to={"now"} fixedDecimals={5} unit="GPUs" />
          <MetricChart label="Total Nvidia GPUs" type="area" metric="totalnvidiagpus" from={"now-60d"} to={"now"} fixedDecimals={2}  ytitle="GPUs" />
        </Box>
        {/* <Box backgroundColor="transparent">
          <MetricStat label="Total CUDA Cores" metric="totalcudacores" from={"now-1d"} to={"now"} fixedDecimals={5} unit="Cores" />
          <MetricChart label="Total CUDA Cores" type="area" metric="totalcudacores" from={"now-60d"} to={"now"} fixedDecimals={2}  ytitle="Cores" />
        </Box> */}
        <Box backgroundColor="transparent">
          <MetricStat label="Total AMD GPUs" metric="totalamdgpus" from={"now-1d"} to={"now"} fixedDecimals={5} unit="GPUs" />
          <MetricChart label="Total AMD GPUs" type="area" metric="totalamdgpus" from={"now-60d"} to={"now"} fixedDecimals={2}  ytitle="GPUs" />
        </Box>
      </SimpleGrid>
      <SimpleGrid columns={{ base: 1, sm: 1, md: 2, lg: 3 }} gap="6" mt={2}>
        <Box backgroundColor="transparent">
          <MetricStat label="Total GPU Memory" metric="totalgpumemory" conversion={convertBytesToGb} from={"now-1d"} to={"now"} fixedDecimals={5} unit="GB" />
          <MetricChart label="Total GPU Memory" type="area" metric="totalgpumemory" conversion={convertBytesToGb} from={"now-60d"} to={"now"} fixedDecimals={2}  ytitle="GB" />
        </Box>
        <Box backgroundColor="transparent">
          <MetricStat label="Total NVIDIA Memory" metric="totalnvidiamemory" conversion={convertBytesToGb} from={"now-1d"} to={"now"} fixedDecimals={5} unit="GB" />
          <MetricChart label="Total NVIDIA Memory" type="area" metric="totalnvidiamemory" conversion={convertBytesToGb} from={"now-60d"} to={"now"} fixedDecimals={2}  ytitle="GB" />
        </Box>
        <Box backgroundColor="transparent">
          <MetricStat label="Total AMD Memory" metric="totalamdmemory" conversion={convertBytesToGb} from={"now-1d"} to={"now"} fixedDecimals={5} unit="GB" />
          <MetricChart label="Total AMD Memory" type="area" metric="totalamdmemory" conversion={convertBytesToGb} from={"now-60d"} to={"now"} fixedDecimals={2}  ytitle="GB" />
        </Box>
      </SimpleGrid>
      <Heading as='h4' size='md' py="5" pl="5" >Disk</Heading>
      <SimpleGrid id="storage" columns={{ base: 1, sm: 1, md: 2, lg: 3 }} gap="6" mt={2}>
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
      <SimpleGrid id="memory" columns={{ base: 1, sm: 1, md: 2, lg: 3 }} gap="6" mt={2}>
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
      <SimpleGrid id="network" columns={{ base: 1, sm: 1, md: 2, lg: 4 }} gap="6" mt={2}>
        <Box backgroundColor="transparent">
          <MetricStat label="Total IPv4 Bandwidth Sent" metric="ipv4bandwidthsent" transform="sumtotal" conversion={convertKbToTb} from={"now-1d"} to={"now"} fixedDecimals={5} unit="TB" />
          <MetricChart label="Total IPv4 Bandwidth Sent" type="area" metric="ipv4bandwidthsent" transform="sumtotal" conversion={convertKbToTb} from={"now-60d"} to={"now"} fixedDecimals={2} ytitle="TB" />
        </Box>
        <Box backgroundColor="transparent">
          <MetricStat label="Total IPv4 Bandwidth Received" metric="ipv4bandwidthreceived" transform="sumtotal" conversion={convertKbToTb} from={"now-1d"} to={"now"} fixedDecimals={5} unit="TB" />
          <MetricChart label="Total IPv4 Bandwidth Received" type="area" metric="ipv4bandwidthreceived" transform="sumtotal" conversion={convertKbToTb} from={"now-60d"} to={"now"} fixedDecimals={2} ytitle="TB" />
        </Box>
        <Box backgroundColor="transparent">
          <MetricStat label="Total Ipv4 Packets Sent" metric="ipv4packetssent" transform="sumtotal" conversion={convertNumToBil} from={"now-1d"} to={"now"} fixedDecimals={5} unit="Bil. Packets" />
          <MetricChart label="Total IPv4 Packets Sent" type="area" metric="ipv4packetssent" transform="sumtotal" conversion={convertNumToBil} from={"now-60d"} to={"now"} fixedDecimals={2} ytitle="Billion" />
        </Box>
        <Box backgroundColor="transparent">
          <MetricStat label="Total Ipv4 Packets Received" metric="ipv4packetsreceived" transform="sumtotal" conversion={convertNumToBil} from={"now-1d"} to={"now"} fixedDecimals={5} unit="Bil. Packets" />
          <MetricChart label="Total IPv4 Packets Received" type="area" metric="ipv4packetsreceived" transform="sumtotal" conversion={convertNumToBil} from={"now-60d"} to={"now"} fixedDecimals={2} ytitle="Billion" />
        </Box>
      </SimpleGrid>
      <Heading as='h4' size='md' py="5" pl="5" >Object Storage</Heading>
      <SimpleGrid id="object-storage" columns={{ base: 1, sm: 1, md: 2, lg: 3 }} gap="6" mt={2}>
        <Box backgroundColor="transparent">
          <MetricStat label="Total Objects" metric="totalobjects" from={"now-1d"} to={"now"} fixedDecimals={5} unit="Objects" />
          <MetricChart label="Total Objects" type="area" metric="totalobjects" from={"now-60d"} to={"now"} fixedDecimals={2}  ytitle="Objects" />
        </Box>
        <Box backgroundColor="transparent">
          <MetricStat label="Used Object Storage" metric="usedobjectstorage" conversion={convertBytesToGb} from={"now-1d"} to={"now"} fixedDecimals={5} unit="GB" />
          <MetricChart label="Used Object Storage" type="area" metric="usedobjectstorage" conversion={convertBytesToGb} from={"now-60d"} to={"now"} fixedDecimals={2}  ytitle="GB" />
        </Box>
        <Box backgroundColor="transparent">
          <MetricStat label="Total Buckets" metric="totalbuckets" from={"now-1d"} to={"now"} fixedDecimals={5} unit="Buckets" />
          <MetricChart label="Total Buckets" type="area" metric="totalbuckets" from={"now-60d"} to={"now"} fixedDecimals={2}  ytitle="Buckets" />
        </Box>
      </SimpleGrid>
    </>
  );
}

export const MemoizedNetworkMetrics = React.memo(NetworkMetrics);