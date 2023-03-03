import { Container, Divider, Heading, SimpleGrid, Text } from "@liftedinit/ui";
import {
  NeighborhoodBlocks,
  NeighborhoodStatus,
  NeighborhoodTransactions,
} from "../features/neighborhoods";

export function Home() {
  const neighborhoodId = 1; // @TODO: Get this from context

  return (
    <Container maxW="container.lg">
      <Heading my={6}>Talib</Heading>
      <Text>A Block Explorer for the Many Protocol</Text>
      <Divider my={6} />
      <NeighborhoodStatus id={neighborhoodId} />
      <Divider my={6} />
      <SimpleGrid columns={2} spacing={6}>
        <NeighborhoodBlocks id={neighborhoodId} />
        <NeighborhoodTransactions id={neighborhoodId} />
      </SimpleGrid>
    </Container>
  );
}
