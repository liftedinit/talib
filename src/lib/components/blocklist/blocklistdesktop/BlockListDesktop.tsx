// Recommended for icons
import React from "react";

import { Table } from "lib/components/customtable/CustomTable";
import { theme } from "lib/styles/customTheme";
import type Block from "lib/types/block";

interface Props {
  blocks: Block[];
}

const BlockListDesktop = ({ blocks }: Props) => {
  // Control current Page
  const [page, setPage] = React.useState(1);

  // Formatter for each block
  const tableData = blocks.map((block) => ({
    block_hash: block.block_hash,
    time: block.time,
    num_of_txs: block.num_of_txs,
  }));
  // Accessor to get a data in block object
  const tableColumns = [
    {
      Header: "BLOCK",
      accessor: "block_hash" as const,
    },
    {
      Header: "TIME",
      accessor: "time" as const,
    },
    {
      Header: "NUMBER OF TXS",
      accessor: "num_of_txs" as const,
    },
  ];
  return (
    <div>
      <Table
        colorScheme={theme.colors.brown}
        // Fallback component when list is empty
        emptyData={{
          text: "Any transaction registered here.",
        }}
        totalRegisters={blocks.length}
        page={page}
        // Listen change page event and control the current page using state
        // eslint-disable-next-line @typescript-eslint/no-shadow
        onPageChange={(page) => setPage(page)}
        columns={tableColumns}
        data={tableData}
      />
    </div>
  );
};
export default BlockListDesktop;
