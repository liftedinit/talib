import { Code, Table, Tbody, Td, Tr } from "@liftedinit/ui";
import { Link } from "react-router-dom";
import { useFindToken } from "./tokens";

export function useTokensMintBurn(data: any) {
  const token = useFindToken(data.argument.symbol);
  return {
    Token: (
      <Code as={Link} to={`/addresses/${token.address}`} color="brand.teal.500">
        {data.argument.symbol}
      </Code>
    ),
    Amounts: (
      <Table variant="unstyled">
        <Tbody>
          {Object.entries(data.argument.amounts).map(([address, amount]) => (
            <Tr mt="5px" mb="5px">
              <Td pt="5px" pb="5px" pl="0" ps="0">
                <Code
                  as={Link}
                  to={`/addresses/${address}`}
                  color="brand.teal.500"
                >
                  {address}
                </Code>
              </Td>
              <Td isNumeric pt="5px" pb="5px" pl="5px">
                {(
                  parseInt(amount as string) /
                  10 ** token.precision
                ).toLocaleString()}{" "}
                {token.symbol}
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    ),
  };
}
