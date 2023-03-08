import { Box, Button, Center, Divider, SimpleGrid } from "@liftedinit/ui";
import { Link } from "react-router-dom";
import {
  NeighborhoodBlocks,
  NeighborhoodStatus,
  NeighborhoodTransactions,
} from "../features/neighborhoods";

export function Home() {
  const neighborhoodId = 1; // @TODO: Get this from context

  return (
    <>
      <NeighborhoodStatus id={neighborhoodId} />
      <Divider my={6} />
      <SimpleGrid columns={2} spacing={6}>
        <Box>
          <NeighborhoodBlocks id={neighborhoodId} />
          <Center>
            <Button as={Link} to="blocks">
              More
            </Button>
          </Center>
        </Box>
        <Box>
          <NeighborhoodTransactions id={neighborhoodId} />
          <Center>
            <Button as={Link} to="transactions">
              More
            </Button>
          </Center>
        </Box>
      </SimpleGrid>
    </>
  );
}
