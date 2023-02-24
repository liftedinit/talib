import { useQuery } from "react-query";
import { Spinner, Stack } from "@liftedinit/ui";
import { ErrorAlert, Stat } from "../../../shared";
import { getNeighborhood } from "../queries";

export function NeighborhoodStatus({ id }: { id: number }) {
  const query = useQuery(["neighborhood", id], getNeighborhood(id));

  return (
    <>
      {query.isError && <ErrorAlert error={query.error as Error} />}
      {query.isLoading ? (
        <Spinner />
      ) : (
        <Stack direction="row" mt={6}>
          <Stat label="Block Height" value={query.data?.block_height} />
          <Stat label="Transactions" value={query.data?.transaction_count} />
          <Stat label="Current Status" value={query.data?.status} />
        </Stack>
      )}
    </>
  );
}
