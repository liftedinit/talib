import { Box, Heading } from "@liftedinit/ui";
import { useQuery } from "@tanstack/react-query";
import { useContext, useState } from "react";
import {
  getNeighborhoodTransactions,
  NeighborhoodContext,
} from "../features/neighborhoods";
import { Pager, TransactionList } from "../shared";

export function Transactions() {
  const { id } = useContext(NeighborhoodContext);
  const [page, setPage] = useState(1);
  const { data, error, isLoading } = useQuery(
    ["neighborhoods", id, "transactions", page],
    getNeighborhoodTransactions(id, { page }),
  );

  return (
    <Box my={6}>
      <Heading size="sm">All Transactions</Heading>
      <TransactionList
        txns={data?.items}
        error={error as Error}
        isLoading={isLoading}
      />
      <Pager page={page} setPage={setPage} totalPages={data?.meta.totalPages} />
    </Box>
  );
}
