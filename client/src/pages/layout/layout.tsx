import {
  Container,
} from "@liftedinit/ui";
import { Navbar } from "./navbar";

export function Layout({ children }: React.PropsWithChildren<{}>) {

  return (
    <>
      <Navbar />
      <Container pb={6} maxW="container.lg">
        {children}
      </Container>
    </>
  );
}
