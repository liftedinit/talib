import { Code, Table, Tbody, Td, Tr } from "@liftedinit/ui";
import { Link } from "react-router-dom";

export function tokensCreate(data: any) {
  const summary = data.argument.summary;
  return {
    Token: (
      <Code as={Link} to={`/addresses/${data.argument.owner}`} color="brand.teal.500">
        {summary.ticker}
      </Code>
    ),
    'Initial Distribution': (
      <Table>
        <Tbody>
          {Object.entries(data.argument.holders).map(([address, amount]) => (
            <Tr>
              <Td>
                <Code
                  as={Link}
                  to={`/addresses/${address}`}
                  color="brand.teal.500"
                >
                  {address}
                </Code>
              </Td>
              <Td >
                {(
                  parseInt(amount as string) /
                  10 ** summary.precision
                ).toLocaleString()}{" "}
                {summary.ticker}
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    ),
  };
}
