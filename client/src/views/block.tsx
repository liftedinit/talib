import { Box, Divider, Stack } from "@liftedinit/ui";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { getNeighborhoodBlock } from "../features/neighborhoods";
import { Stat, TransactionList } from "../shared";

export function Block() {
  const id = 1; // @TODO: Get this from context
  const { hash } = useParams();

  const { data, error, isLoading } = useQuery(
    ["neighborhoods", id, "blocks", hash],
    getNeighborhoodBlock(id, hash as string),
  );

  return (
    <Box my={6}>
      <Stack direction="row" mt={6}>
        <Stat label="Height" value={data?.height.toLocaleString()} />
        <Stat label="Transactions" value={data?.transactions.length} />
        <Stat label="Time" value={new Date(data?.dateTime).toLocaleString()} />
      </Stack>
      <Divider />
      <TransactionList
        txns={data?.transactions}
        error={error as Error}
        isLoading={isLoading}
      />
    </Box>
  );
}
