import {
  Container,
} from "@liftedinit/ui";
import { Navbar } from "./navbar";

export function WideLayout({ children }: React.PropsWithChildren<{}>) {

  return (
    <>
      <Navbar />
      <Container pb={6} maxW="container.2xl">
        {children}
      </Container>
    </>
  );
}
