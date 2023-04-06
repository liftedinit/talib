import { Box, Code, Heading, Tag, Text } from "@liftedinit/ui";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { useContext } from "react";
import { Link, useParams } from "react-router-dom";

import { getNeighborhoodTransaction, NeighborhoodContext } from "api";
import { ObjectTable, PrettyMethods, QueryBox, TableObject } from "ui";
import { ago } from "utils";

import { LedgerSend } from "./ledger-send";

const methodDetails: {
  [method: string]: (data: UseQueryResult) => TableObject;
} = {
  "ledger.send": LedgerSend,
};

export function Transaction() {
  const { id } = useContext(NeighborhoodContext);
  const { hash } = useParams();

  const query = useQuery(
    ["neighborhoods", id, "transactions", hash],
    getNeighborhoodTransaction(id, hash as string),
  );
  const { data } = query;

  // Start with transaction basics
  let txn: TableObject = data
    ? {
        Hash: <Code>{data.hash}</Code>,
        Height: (
          <Text
            as={Link}
            to={`/blocks/${data.blockHeight}`}
            color="brand.teal.500"
          >
            {data.blockHeight.toLocaleString()}
          </Text>
        ),
        Time: (
          <Text>
            {ago(new Date(data.dateTime))} (
            <Code>{new Date(data.dateTime).toISOString()}</Code>)
          </Text>
        ),
        Type: data.method ? (
          <Text>
            <Tag variant="outline" size="sm">
              {PrettyMethods[data.method]}
            </Tag>{" "}
            (<Code>{data.method}</Code>)
          </Text>
        ) : (
          "Unknown"
        ),
      }
    : {};

  // If we have details for the method type, add them
  if (data?.argument) {
    txn = { ...txn, ...methodDetails[data.method](data) };
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
