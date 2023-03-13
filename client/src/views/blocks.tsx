import { Box, Heading } from "@liftedinit/ui";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getNeighborhoodBlocks } from "../features/neighborhoods";
import { BlockList, Pager } from "../shared";

export function Blocks() {
  const id = 1; // @TODO: Get this from context
  const [page, setPage] = useState(1);

  const { data, error, isLoading } = useQuery(
    ["neighborhoods", id, "blocks", page],
    getNeighborhoodBlocks(id, { page }),
  );

  return (
    <Box my={6}>
      <Heading size="sm">All Blocks</Heading>
      <BlockList
        blocks={data?.items}
        error={error as Error}
        isLoading={isLoading}
      />
      <Pager page={page} setPage={setPage} totalPages={data?.meta.totalPages} />
    </Box>
  );
}
