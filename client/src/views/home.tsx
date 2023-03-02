import { Container, Divider, Heading, Stack, Text } from "@liftedinit/ui";
import {
  NeighborhoodBlocks,
  NeighborhoodStatus,
  NeighborhoodTransactions,
} from "../features/neighborhoods";

export function Home() {
  const neighborhoodId = 1; // @TODO: Get this from context

  return (
    <Container maxW="container.md">
      <Heading my={6}>Talib</Heading>
      <Text>A Block Explorer for the Many Protocol</Text>
      <Divider my={6} />
      <NeighborhoodStatus id={neighborhoodId} />
      <Divider my={6} />
      <Stack direction="row">
        <NeighborhoodBlocks id={neighborhoodId} />
        <NeighborhoodTransactions id={neighborhoodId} />
      </Stack>
    </Container>
  );
}
