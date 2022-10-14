// Recommended for icons
import { Box } from "@chakra-ui/react";
import React from "react";

import { NoContent } from "../../customtable/components/NoContent";
import { CardTable } from "lib/components/blocklist/blocklistmobile/components/CustomCardTable";
import { theme } from "lib/styles/customTheme";
import type Block from "lib/types/block";

interface Props {
  blocks: Block[];
}

const BlockListMobile = ({ blocks }: Props) => {
  // Control current Page
  const [page, setPage] = React.useState(1);

  if (blocks.length === 0) {
    return <NoContent text="No information to show." />;
  }
  // Formatter for each block
  const tableData = blocks.map((block) => ({
    block_hash: block.block_hash,
    time: block.time,
    num_of_txs: block.num_of_txs,
  }));

  return (
    <Box>
      <CardTable
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
        data={tableData}
      />
    </Box>
  );
};

export default BlockListMobile;
