// Use Chakra Ui for create a custom component for display field data in table
import { Box, Heading, Center } from "@chakra-ui/react";
// Recommended for icons
import React from "react";

import { Table } from "lib/components/customtable/CustomTable";
import { theme } from "lib/styles/customTheme";

type Node = {
  id: number;
  node_name: string;
  node_ip: string;
  address: string;
  time: string;
  total_staked: number;
  total_rewards: string;
  total_computing_power: string;
  latency: string;
};

// Example list of blocks, to replace it with many.js block list get method
const nodes: Node[] = [
  {
    id: 1,
    node_name: "Unknown",
    node_ip: "200.32.22.1",
    address: "execution-003.mainnet6.nodes.onflow.org:356",
    time: "2hs 36min ago",
    total_staked: 958230553,
    total_rewards: "$2.73 USD",
    total_computing_power: "48.763",
    latency: "106ms",
  },
  {
    id: 2,
    node_name: "Unknown 2",
    node_ip: "200.12.21.2",
    address: "execution-002.mainnet6.nodes.onflow.org:356",
    time: "2hs 46min ago",
    total_staked: 955530553,
    total_rewards: "$2.23 USD",
    total_computing_power: "58.763",
    latency: "107ms",
  },
  {
    id: 3,
    node_name: "Unknown3",
    node_ip: "200.32.13.2",
    address: "execution-032.mainnet6.nodes.onflow.org:356",
    time: "2hs 16min ago",
    total_staked: 955530553,
    total_rewards: "$2.23 USD",
    total_computing_power: "58.763",
    latency: "107ms",
  },
  {
    id: 4,
    node_name: "Unknown 4",
    node_ip: "200.16.11.2",
    address: "execution-025.mainnet6.nodes.onflow.org:356",
    time: "2hs 21min ago",
    total_staked: 955530553,
    total_rewards: "$2.23 USD",
    total_computing_power: "8.763",
    latency: "127ms",
  },
  {
    id: 5,
    node_name: "Unknown 5",
    node_ip: "200.15.21.2",
    address: "execution-012.mainnet6.nodes.onflow.org:356",
    time: "2hs 46min ago",
    total_staked: 905530551,
    total_rewards: "$2.23 USD",
    total_computing_power: "18.763",
    latency: "117ms",
  },
  {
    id: 6,
    node_name: "Unknown 6",
    node_ip: "200.14.21.2",
    address: "execution-006.mainnet6.nodes.onflow.org:356",
    time: "2hs 26min ago",
    total_staked: 925530552,
    total_rewards: "$2.23 USD",
    total_computing_power: "38.763",
    latency: "105ms",
  },
  {
    id: 7,
    node_name: "Unknown 7",
    node_ip: "200.13.21.2",
    address: "execution-102.mainnet6.nodes.onflow.org:356",
    time: "1hs 26min ago",
    total_staked: 953530555,
    total_rewards: "$2.33 USD",
    total_computing_power: "8.963",
    latency: "157ms",
  },
  {
    id: 8,
    node_name: "Unknown 8",
    node_ip: "200.37.21.2",
    address: "execution-042.mainnet6.nodes.onflow.org:356",
    time: "2hs 26min ago",
    total_staked: 955530153,
    total_rewards: "$3.23 USD",
    total_computing_power: "38.763",
    latency: "101ms",
  },
];

const NodesList = () => {
  // Control current Page
  const [page, setPage] = React.useState(1);

  // Formatter for each user
  const tableData = nodes.map((node) => ({
    node_name: node.node_name,
    node_ip: node.node_ip,
    address: node.address,
    time: node.time,
    total_staked: node.total_staked,
    total_rewards: node.total_rewards,
    total_computing_power: node.total_computing_power,
    latency: node.latency,
  }));

  // Accessor to get a data in block object
  const tableColumns = [
    {
      Header: "NODE NAME",
      accessor: "node_name" as const,
    },
    {
      Header: "NODE IP",
      accessor: "node_ip" as const,
    },
    {
      Header: "ADDRESS",
      accessor: "address" as const,
    },
    {
      Header: "TIME",
      accessor: "time" as const,
    },
    {
      Header: "TOTAL STAKED",
      accessor: "total_staked" as const,
    },
    {
      Header: "TOTAL REWARDS",
      accessor: "total_rewards" as const,
    },
    {
      Header: "TOTAL COMPUTING POWER",
      accessor: "total_computing_power" as const,
    },
    {
      Header: "LATENCY",
      accessor: "latency" as const,
    },
  ];

  return (
    <Center maxW="full" fontSize="14px">
      <Box w={{ sm: "23em", md: "54em", lg: "82em" }} py="1">
        <Box>
          <Heading fontSize="32px" fontWeight={400} as="h3">
            NODES
          </Heading>
        </Box>
        <Box
          backgroundColor="white"
          mt="6"
          fontSize="14px"
          w={{ sm: "23em", md: "54em", lg: "82em" }}
          fontWeight={400}
        >
          <Table
            colorScheme={theme.colors.brown}
            // Fallback component when list is empty
            emptyData={{
              text: "Any transaction registered here.",
            }}
            totalRegisters={nodes.length}
            page={page}
            // Listen change page event and control the current page using state
            // eslint-disable-next-line @typescript-eslint/no-shadow
            onPageChange={(page) => setPage(page)}
            columns={tableColumns}
            data={tableData}
          />
        </Box>
      </Box>
    </Center>
  );
};

export default NodesList;
