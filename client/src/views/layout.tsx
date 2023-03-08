import { Container, Divider, Heading, Text } from "@liftedinit/ui";
import { Link } from "react-router-dom";

export function Layout({ children }: React.PropsWithChildren<{}>) {
  return (
    <Container maxW="container.lg">
      <Heading my={6}>
        <Link to="/">Talib</Link>
      </Heading>
      <Text>A Block Explorer for the Many Protocol</Text>
      <Divider my={6} />
      {children}
    </Container>
  );
}
