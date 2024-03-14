import { useLayoutEffect, useState } from 'react';
import { Box, Heading, Center, Grid, GridItem, useMediaQuery } from "@liftedinit/ui";
import { MetricNav } from "ui";
import { NetworkMetrics } from "./networkMetrics";
import { MdMemory, MdStorage, MdDns} from "react-icons/md";
import { SiKubernetes } from "react-icons/si";
import { FaHive, FaNetworkWired, FaFile, FaServer, FaGhost, FaRobot } from "react-icons/fa6"
import { debounce } from 'lodash';

const navItems = [
  { label: "Neighborhoods", section: "blockchain", icon: FaHive },
  { label: "Nodes", section: "nodes", icon: FaServer },
  { label: "Kubernetes", section: "kubernetes", icon: SiKubernetes },
  { label: "Web", section: "web", icon: MdDns },
  { label: "Hosting", section: "hosting", icon: FaGhost },
  { label: "AI", section: "ai", icon: FaRobot },
  { label: "Storage", section: "storage", icon: MdStorage },
  { label: "Memory", section: "memory", icon: MdMemory },
  { label: "Network", section: "network", icon: FaNetworkWired },
  { label: "Object Storage", section: "object-storage", icon: FaFile },
];

export function Metrics() {
  const [isSticky, setSticky] = useState(false);

  const [mobileWidth] = useMediaQuery('(max-width: 768px)');

  const debouncedHandleScroll = debounce(() => {
    const threshold = 100;
    const offset = window.scrollY;
    setSticky(offset > threshold);
  }, 0);

  useLayoutEffect(() => {
    const handleResize = () => {
      setSticky(false);
    };

    window.addEventListener('scroll', debouncedHandleScroll);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('scroll', debouncedHandleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, [debouncedHandleScroll]);

  return (
    <>
    <Grid gap={3}>
        <Center mt={12}>
          <Heading fontWeight="light">
            <b>Manifest</b> Network Metrics
          </Heading>
        </Center>
    </Grid>
    <Grid gap={3} templateColumns={{base: "1fr", md: "12rem 1fr"}} >
      <GridItem>
        {mobileWidth ? null : (
        <Box 
          position={isSticky ? 'fixed' : 'static'} 
          top={10}  
          className="metric-nav" 
        >
          <MetricNav  navItems={navItems} />
        </Box>
        )}
      </GridItem>
      <GridItem>
        <NetworkMetrics />
      </GridItem>
    </Grid>
  </>
  );
}
