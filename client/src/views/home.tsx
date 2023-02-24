import {
  Box,
  Container,
  Divider,
  Heading,
  Stack,
  Stat,
  StatLabel,
  StatNumber,
  Text,
} from "@liftedinit/ui";

export function Home() {
  return (
    <Container maxW="container.md">
      <Heading my={6}>Talib</Heading>
      <Text>A Block Explorer for the Many Protocol</Text>
      <Divider my={6} />
      <Stack direction="row" mt={6}>
        <Stat bg="white" p={6}>
          <StatLabel>Block Height</StatLabel>
          <StatNumber>
            <pre>[block height]</pre>
          </StatNumber>
        </Stat>
        <Stat bg="white" p={6}>
          <StatLabel># of Transactions</StatLabel>
          <StatNumber>
            <pre>[transactions]</pre>
          </StatNumber>
        </Stat>
        <Stat bg="white" p={6}>
          <StatLabel>Current Status</StatLabel>
          <StatNumber>
            <pre>[status]</pre>
          </StatNumber>
        </Stat>
      </Stack>
      <Divider my={6} />
      <Stack direction="row">
        <Box bg="white" p={6} w="50%">
          <pre>[block list]</pre>
        </Box>
        <Box bg="white" p={6} w="50%">
          <pre>[transaction list]</pre>
        </Box>
      </Stack>
    </Container>
  );
}
