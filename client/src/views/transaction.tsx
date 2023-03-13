import { Box, Divider, Heading, Stack } from "@liftedinit/ui";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getNeighborhoodTransaction } from "../features/neighborhoods";
import { Stat } from "../shared";

export function Transaction() {
  const id = 1; // @TODO: Get this from context
  const { hash } = useParams();

  const { data, error, isLoading } = useQuery(
    ["neighborhoods", id, "transactions", hash],
    getNeighborhoodTransaction(id, hash as string),
  );

  return (
    <Box my={6}>
      <Heading size="sm">Transaction Details</Heading>
      <Stack direction="row" mt={6}>
        <Stat label="Hash" value={data?.hash} />
        <Stat label="Time" value={new Date(data?.dateTime).toLocaleString()} />
      </Stack>
      <Divider />
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </Box>
  );
}
