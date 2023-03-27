import { Box, Button, Center, Heading, SimpleGrid } from "@liftedinit/ui";
import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { Link } from "react-router-dom";

import {
  getNeighborhoodBlocks,
  getNeighborhoodTransactions,
  NeighborhoodContext,
} from "api";
import { BlockList, TransactionList } from "ui";

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
      <Center my={12}>
        <Heading fontWeight="light">
          A block explorer for the <b>Manifest</b> network
        </Heading>
      </Center>
      <NeighborhoodStatus id={id} />
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
