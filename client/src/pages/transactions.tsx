import { Box, Heading, Text } from "@liftedinit/ui";
import { useQuery } from "@tanstack/react-query";
import { useContext, useState } from "react";
import { Link } from "react-router-dom";

import { getNeighborhoodTransactions, NeighborhoodContext } from "api";
import { Pager, TransactionList } from "ui";

import { useBgColor } from "utils";

export function Transactions() {
  const { id } = useContext(NeighborhoodContext);
  const [page, setPage] = useState(1);
  const { data, error, isLoading } = useQuery(
    ["neighborhoods", id, "transactions", page],
    getNeighborhoodTransactions(id, { page }),
  );

  const bg = useBgColor();

  return (
    <Box my={6} p={6} bg={bg}>
      <Heading size="sm">
        <Text as={Link} color="brand.teal.500" to="/">
          Home
        </Text>{" "}
        / All Transactions
      </Heading>
      <TransactionList
        txns={data?.items}
        error={error as Error}
        isLoading={isLoading}
      />
      <Pager page={page} setPage={setPage} totalPages={data?.meta.totalPages} />
    </Box>
  );
}
