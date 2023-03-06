import { Spinner, Stack } from "@liftedinit/ui";
import { useQuery } from "react-query";
import { Stat } from "../../../shared";
import { getNeighborhood } from "../queries";

export function NeighborhoodStatus({ id }: { id: number }) {
  const query = useQuery(["neighborhoods", id], getNeighborhood(id));

  const height = query.data?.latestBlockHeight.toLocaleString();
  const txnCount = query.data?.totalTransactionCount.toLocaleString();
  const status = query.isError ? "Unavailable" : "Available";

  return (
    <>
      {query.isLoading ? (
        <Spinner />
      ) : (
        <Stack direction="row" mt={6}>
          <Stat label="Height" value={height} />
          <Stat label="Transactions" value={txnCount} />
          <Stat label="Status" value={status} />
        </Stack>
      )}
    </>
  );
}
