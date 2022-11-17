// Recommended for icons
import { Box } from "@chakra-ui/react";
import React from "react";

import { NoContent } from "../../customtable/components/NoContent";
import { CardTable } from "lib/components/blocklist/blocklistmobile/components/CustomCardTable";
import { theme } from "lib/styles/customTheme";
import type BlockDetail from "lib/types/blockDetail";

interface Props {
  blockdetails: BlockDetail[];
}

const BlockDetailListMobile = ({ blockdetails }: Props) => {
  // Control current Page
  const [page, setPage] = React.useState(1);

  if (blockdetails.length === 0) {
    return <NoContent text="No information to show." />;
  }
  // Formatter for each block
  const tableData = blockdetails.map((blockdetail) => ({
    block_hash: blockdetail.block_hash,
    time: blockdetail.time,
    from: blockdetail.from,
    to: blockdetail.to,
    type: blockdetail.type,
  }));

  return (
    <Box>
      <CardTable
        colorScheme={theme.colors.brown}
        // Fallback component when list is empty
        emptyData={{
          text: "Any transaction registered here.",
        }}
        totalRegisters={blockdetails.length}
        page={page}
        // Listen change page event and control the current page using state
        // eslint-disable-next-line @typescript-eslint/no-shadow
        onPageChange={(page) => setPage(page)}
        data={tableData}
      />
    </Box>
  );
};

export default BlockDetailListMobile;
