import { Box, Button, Divider, SimpleGrid } from "@liftedinit/ui";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import {
  getNeighborhoodBlocks,
  getNeighborhoodTransactions,
  NeighborhoodStatus,
} from "../features/neighborhoods";
import { BlockList, TransactionList } from "../shared";

export function Home() {
  const id = 1; // @TODO: Get this from context

  const {
    data: blocksData,
    error: blocksError,
    isLoading: blocksLoading,
  } = useQuery(["neighborhoods", id, "blocks"], getNeighborhoodBlocks(id));

  const {
    data: txnData,
    error: txnError,
    isLoading: txnLoading,
  } = useQuery(["neighborhoods", id, "txns"], getNeighborhoodTransactions(id));

  return (
    <>
      <NeighborhoodStatus id={id} />
      <Divider my={6} />
      <SimpleGrid columns={2} spacing={6}>
        <Box>
          <BlockList
            blocks={blocksData?.items}
            error={blocksError as Error}
            isLoading={blocksLoading}
          />
          <Button as={Link} to="blocks" isFullWidth>
            More
          </Button>
        </Box>
        <Box>
          <TransactionList
            txns={txnData?.items}
            error={txnError as Error}
            isLoading={txnLoading}
          />
          <Button as={Link} to="transactions" isFullWidth>
            More
          </Button>
        </Box>
      </SimpleGrid>
    </>
  );
}
