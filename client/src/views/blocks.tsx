import { Box, Button, ButtonGroup, Center } from "@liftedinit/ui";
import { useState } from "react";
import { NeighborhoodBlocks } from "../features/neighborhoods";

export function Blocks() {
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const neighborhoodId = 1; // @TODO: Get this from context

  return (
    <Box my={6}>
      <NeighborhoodBlocks
        id={neighborhoodId}
        page={page}
        setTotalPages={setTotalPages}
      />
      <Center my={6}>
        <ButtonGroup isAttached>
          <Button onClick={() => setPage(page - 1)} isDisabled={page === 1}>
            Previous
          </Button>
          <Button
            onClick={() => setPage(page + 1)}
            isDisabled={page >= totalPages}
          >
            Next
          </Button>
        </ButtonGroup>
      </Center>
    </Box>
  );
}
