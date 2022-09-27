// Use Chakra Ui for create a custom component for display field data in table
import { Box, Heading, Center } from "@chakra-ui/react";
// Recommended for icons
import React from "react";

import NodesData from "../../../demodata/NodesData";
import { Table } from "lib/components/customtable/CustomTable";
import { theme } from "lib/styles/customTheme";
import type Node from "lib/types/node";

// todo: replace with real method to get information and remove the demodata import
const nodes = NodesData;

const NodesList = () => {
  // Control current Page
  const [page, setPage] = React.useState(1);

  // Formatter for each user
  const tableData: Node[] = nodes.map((node) => ({
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
