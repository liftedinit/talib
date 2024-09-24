import { Box, Heading, Text } from "@liftedinit/ui";
import { useQuery } from "@tanstack/react-query";
import { useContext, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { getNeighborhoodAddress, NeighborhoodContext } from "api";
import { ObjectTable, QueryBox, TransactionList, Pager } from "ui";

import { useBgColor } from "utils";

export function Address() {
  const { id } = useContext(NeighborhoodContext);
  const { address } = useParams();
  const [page, setPage] = useState(1);
  const query = useQuery(
    ["neighborhoods", id, "addresses", address, page],
    getNeighborhoodAddress(id, address as string, { page }),
  );
  const { data, error, isLoading } = query;

  const bg = useBgColor();

  console.log(`data: ${JSON.stringify(data)}`);
  console.log(`error: ${error}`);
  console.log(`totalPages: ${JSON.stringify(data?.transactions.totalPages)}`);
  console.log(`page: ${page}`);

  return (
    <Box my={6} bg={bg} p={6}>
      <Heading size="sm">
        <Text as={Link} color="brand.teal.500" to="/">
          Home
        </Text>{" "}
        / Address Details
      </Heading>
      <QueryBox query={query}>
        <ObjectTable obj={{ Address: address }} />
      </QueryBox>
      {data?.transactions.items.length ? (
        <TransactionList
          txns={data?.transactions.items}
          error={error as Error}
          isLoading={isLoading}
        />
      ) : (
          ""
      )}

      <Pager page={page} setPage={setPage} totalPages={data?.transactions.meta.totalPages} />
    </Box>
  );
}
