import { useQuery } from "react-query";
import { Spinner, Box } from "@liftedinit/ui";
import { ErrorAlert } from "../../../shared";
import { getNeighborhoodTransactions } from "../queries";

export function NeighborhoodTransactions({ id }: { id: number }) {
  const query = useQuery(
    ["neighborhoods", id, "transactions"],
    getNeighborhoodTransactions(id)
  );

  return (
    <>
      {query.isError && <ErrorAlert error={query.error as Error} />}
      {query.isLoading ? (
        <Spinner />
      ) : (
        <Box bg="white" p={6} w="50%">
          {query.data?.map(<pre>Txn</pre>)}
        </Box>
      )}
    </>
  );
}
