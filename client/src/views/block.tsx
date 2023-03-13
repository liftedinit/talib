import { Box, Divider, Heading, Stack } from "@liftedinit/ui";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getNeighborhoodBlock } from "../features/neighborhoods";
import { Stat, TransactionList } from "../shared";

export function Block() {
  const id = 1; // @TODO: Get this from context
  const { hash } = useParams();
  let txns = [];

  const { data, error, isLoading } = useQuery(
    ["neighborhoods", id, "blocks", hash],
    getNeighborhoodBlock(id, hash as string),
  );
  if (data) {
    txns = data.transactions.map((txn: any) => ({
      ...txn,
      blockHash: data.blockHash,
      blockHeight: data.height,
      dateTime: data.dateTime,
    }));
  }

  return (
    <Box my={6}>
      <Heading size="sm">Block Details</Heading>
      <Stack direction="row" mt={6}>
        <Stat label="Height" value={data?.height.toLocaleString()} />
        <Stat label="Transactions" value={data?.transactions.length} />
        <Stat label="Time" value={new Date(data?.dateTime).toLocaleString()} />
      </Stack>
      <Divider />
      <TransactionList
        txns={txns}
        error={error as Error}
        isLoading={isLoading}
      />
    </Box>
  );
}
