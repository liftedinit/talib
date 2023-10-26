import { Box, Code, Heading, Text } from "@liftedinit/ui";
import { useQuery } from "@tanstack/react-query";
import { ReactNode, useContext } from "react";
import { Link, useParams } from "react-router-dom";

import { getNeighborhoodBlock, NeighborhoodContext } from "api";
import { ObjectTable, QueryBox, TransactionList } from "ui";
import { ago, useBgColor } from "utils";

export function Block() {
  const { id } = useContext(NeighborhoodContext);
  const { hash } = useParams();
  const query = useQuery(
    ["neighborhoods", id, "blocks", hash],
    getNeighborhoodBlock(id, hash as string),
  );
  const { data, error, isLoading } = query;

  let block: { [key: string]: ReactNode } = data
    ? {
        Hash: <Code>{data.blockHash}</Code>,
        Height: data.height.toLocaleString(),
        Time: (
          <Text>
            {ago(new Date(data.dateTime))} (
            <Code>{new Date(data.dateTime).toISOString()}</Code>)
          </Text>
        ),
      }
    : {};

  const bg = useBgColor();

  return (
    <Box my={6} bg={bg} p={5}>
      <Heading size="sm">
        <Text as={Link} color="brand.teal.500" to="/">
          Home
        </Text>{" "}
        / Block Details
      </Heading>
      <QueryBox query={query}>
        <ObjectTable obj={block} />
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
