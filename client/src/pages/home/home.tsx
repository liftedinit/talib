import { Box, Button, Divider, SimpleGrid } from "@liftedinit/ui";
import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { Link } from "react-router-dom";

import {
  getNeighborhoodBlocks,
  getNeighborhoodTransactions,
  NeighborhoodContext,
} from "api";
import { BlockList, Search, TransactionList } from "ui";

import { NeighborhoodStatus } from "./status";

export function Home() {
  const { id } = useContext(NeighborhoodContext);

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
      <Search />
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
