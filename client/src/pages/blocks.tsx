import { Box, Heading, Text } from "@liftedinit/ui";
import { useQuery } from "@tanstack/react-query";
import { useContext, useState } from "react";
import { Link } from "react-router-dom";

import { getNeighborhoodBlocks, NeighborhoodContext } from "api";
import { BlockList, Pager } from "ui";

export function Blocks() {
  const { id } = useContext(NeighborhoodContext);
  const [page, setPage] = useState(1);

  const { data, error, isLoading } = useQuery(
    ["neighborhoods", id, "blocks", page],
    getNeighborhoodBlocks(id, { page }),
  );

  return (
    <Box my={6}>
      <Heading size="sm">
        <Text as={Link} color="brand.teal.500" to="/">
          Home
        </Text>{" "}
        / All Blocks
      </Heading>
      <BlockList
        blocks={data?.items}
        error={error as Error}
        isLoading={isLoading}
      />
      <Pager page={page} setPage={setPage} totalPages={data?.meta.totalPages} />
    </Box>
  );
}
