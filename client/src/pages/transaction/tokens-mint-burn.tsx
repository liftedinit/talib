import { Code, Table, Tbody, Td, Tr } from "@liftedinit/ui";
import { Link } from "react-router-dom";

export function tokensMintBurn(data: any) {
  return {
    Token: (
      <Code
        as={Link}
        to={`/addresses/${data.argument.symbol}`}
        color="brand.teal.500"
      >
        {data.argument.symbol}
      </Code>
    ),
    Amounts: (
      <Table>
        <Tbody>
          {Object.entries(data.argument.amounts).map(([address, amount]) => (
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
              <Td>{amount as string}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    ),
  };
}
