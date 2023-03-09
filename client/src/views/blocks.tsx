import { Box } from "@liftedinit/ui";
import { useState } from "react";
import { useQuery } from "react-query";
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
      <BlockList
        blocks={data?.items}
        error={error as Error}
        isLoading={isLoading}
      />
      <Pager page={page} setPage={setPage} totalPages={data?.meta.totalPages} />
    </Box>
  );
}
