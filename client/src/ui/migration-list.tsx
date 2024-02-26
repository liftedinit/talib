import {
  Box,
  Center,
  Flex,
  Heading,
  Spacer,
  Spinner,
  Table,
  Code, 
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@liftedinit/ui";
import { Link } from "react-router-dom";

import { ErrorAlert } from "ui";
import { abbr, ago, by, useBgColor } from "utils";

interface MigrationSummary {
  status: number;
  uuid: string;
  manyHash: string;
  createdDate: string;
}

interface MigrationListProps {
  migrations: MigrationSummary[];
  error?: Error;
  isLoading?: boolean;
}

export function MigrationList({
  migrations = [],
  error,
  isLoading = false,
}: MigrationListProps) {
  const bg = useBgColor();

  return (
    <Box my={6} p={6} bg={bg}>
      <Flex mb={6}>
        <Heading size="sm">Migrations</Heading>
        <Spacer />
        {error && <ErrorAlert error={error} />}
      </Flex>
      {isLoading ? (
        <Center>
          <Spinner />
        </Center>
      ) : (
        <Table size="sm" className="talib-table">
          <Thead>
            <Th>UUID</Th>
            <Th>Hash</Th>
            <Th>Time</Th>
          </Thead>
          <Tbody>
            {migrations.sort(by("createdDate")).map((migration) => (
              <Tr h={12}>
                <Td>
                  <Link to={`/migrations/${migration.uuid}`}>
                    <Text color="brand.teal.500">
                      <pre>{abbr(migration.uuid)}</pre>
                    </Text>
                  </Link>
                </Td>
                <Td>
                  <Link to={`/transactions/${migration.manyHash}`}>
                    <Text color="brand.teal.500">
                      <pre>{abbr(migration.manyHash)}</pre>
                    </Text>
                  </Link>
                </Td>
                <Td>{ago(new Date(migration.createdDate))}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
    </Box>
  );
}
