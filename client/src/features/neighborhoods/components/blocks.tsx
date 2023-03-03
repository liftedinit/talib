import { Box, Spinner } from "@liftedinit/ui";
import { useQuery } from "react-query";
import { ErrorAlert } from "../../../shared";
import { getNeighborhoodBlocks } from "../queries";

export function NeighborhoodBlocks({ id }: { id: number }) {
  const query = useQuery(
    ["neighborhoods", id, "blocks"],
    getNeighborhoodBlocks(id),
  );

  return (
    <>
      {query.isError && <ErrorAlert error={query.error as Error} />}
      {query.isLoading ? (
        <Spinner />
      ) : (
        <Box bg="white" p={6} w="50%">
          {query.data?.items &&
            query.data.items.map((item: { height: number }) => (
              <pre>BLOCK[{item.height}]</pre>
            ))}
        </Box>
      )}
    </>
  );
}
