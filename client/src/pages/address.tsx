import { Box, Heading, Text } from "@liftedinit/ui";
import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { Link, useParams } from "react-router-dom";

import { getNeighborhoodAddress, NeighborhoodContext } from "api";
import { ObjectTable, QueryBox, TransactionList } from "ui";

import { useBgColor } from "utils";

export function Address() {
  const { id } = useContext(NeighborhoodContext);
  const { address } = useParams();

  const query = useQuery(
    ["neighborhoods", id, "addresses", address],
    getNeighborhoodAddress(id, address as string),
  );
  const { data, error, isLoading } = query;

  const bg = useBgColor();

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
      {data?.transactions.length ? (
        <TransactionList
          txns={data.transactions}
          error={error as Error}
          isLoading={isLoading}
        />
      ) : (
        ""
      )}
    </Box>
  );
}
