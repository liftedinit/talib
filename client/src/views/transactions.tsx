import { Box } from "@liftedinit/ui";
import { useState } from "react";
import { useQuery } from "react-query";
import { getNeighborhoodTransactions } from "../features/neighborhoods";
import { Pager, TransactionList } from "../shared";

export function Transactions() {
  const id = 1; // @TODO: Get this from context
  const [page, setPage] = useState(1);
  const { data, error, isLoading } = useQuery(
    ["neighborhoods", id, "transactions", page],
    getNeighborhoodTransactions(id, { page }),
  );

  return (
    <Box my={6}>
      <TransactionList
        txns={data?.items}
        error={error as Error}
        isLoading={isLoading}
      />
      <Pager page={page} setPage={setPage} totalPages={data?.meta.totalPages} />
    </Box>
  );
}
