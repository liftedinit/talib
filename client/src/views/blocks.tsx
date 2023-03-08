import { Box, Button, ButtonGroup, Center } from "@liftedinit/ui";
import React from "react";
import { NeighborhoodBlocks } from "../features/neighborhoods";

export function Blocks() {
  const [page, setPage] = React.useState(1);
  const neighborhoodId = 1; // @TODO: Get this from context

  return (
    <Box my={6}>
      <NeighborhoodBlocks id={neighborhoodId} page={page} />
      <Center my={6}>
        <ButtonGroup isAttached>
          <Button onClick={() => setPage(page - 1)} isDisabled={page === 1}>
            Previous
          </Button>
          <Button onClick={() => setPage(page + 1)}>Next</Button>
        </ButtonGroup>
      </Center>
    </Box>
  );
}
