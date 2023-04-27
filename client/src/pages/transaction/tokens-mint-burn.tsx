import { Code, Table, Tbody, Td, Tr } from "@liftedinit/ui";
import { Link } from "react-router-dom";
import { findToken } from "./tokens";

export function tokensMintBurn(data: any) {
  const token = findToken(data.argument.symbol);
  return {
    Token: (
      <Code as={Link} to={`/addresses/${token.address}`} color="brand.teal.500">
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
              <Td isNumeric>
                {(
                  parseInt(amount as string) /
                  10 ** token.precision
                ).toLocaleString()}{" "}
                {token.ticker}
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    ),
  };
}
