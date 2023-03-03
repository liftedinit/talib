import { Spinner, Stack } from "@liftedinit/ui";
import { useQuery } from "react-query";
import { ErrorAlert, Stat } from "../../../shared";
import { getNeighborhood } from "../queries";

export function NeighborhoodStatus({ id }: { id: number }) {
  const query = useQuery(["neighborhoods", id], getNeighborhood(id));
  const status = query.isLoadingError ? "Unavailable" : "Available";

  return (
    <>
      {query.isError && <ErrorAlert error={query.error as Error} />}
      {query.isLoading ? (
        <Spinner />
      ) : (
        <Stack direction="row" mt={6}>
          <Stat label="Block Height" value={query.data?.latestBlockHeight} />
          <Stat label="Transactions" value={query.data?.transaction_count} />
          <Stat label="Current Status" value={status} />
        </Stack>
      )}
    </>
  );
}
