import { Box, Code, Heading, Text } from "@liftedinit/ui";
import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { Link, useParams } from "react-router-dom";

import { getNeighborhoodTransaction, NeighborhoodContext } from "api";
import { ObjectTable, QueryBox, TableObject } from "ui";
import { basics, details } from ".";

export function Transaction() {
  const { id } = useContext(NeighborhoodContext);
  const { hash } = useParams();

  const query = useQuery(
    ["neighborhoods", id, "transactions", hash],
    getNeighborhoodTransaction(id, hash as string),
  );
  const { data } = query;

  // Start with transaction basics
  let txn: TableObject = data ? basics(data) : {};

  // Add details if they're populated
  if (data?.argument) {
    txn = { ...txn, ...details(data) };
  }

  // Add request and response (in CBOR) at the end
  txn = data
    ? {
        ...txn,
        Request: <Code maxW="50em">{data.request}</Code>,
        Response: <Code maxW="50em">{data.response}</Code>,
      }
    : txn;

  return (
    <Box my={6}>
      <Heading size="sm">
        <Text as={Link} color="brand.teal.500" to="/">
          Home
        </Text>{" "}
        / Transaction Details
      </Heading>
      <QueryBox query={query}>
        <ObjectTable obj={txn} />
      </QueryBox>
    </Box>
  );
}
