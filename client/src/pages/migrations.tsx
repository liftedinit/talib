import { Box, Heading, Text } from "@liftedinit/ui";
import { useQuery } from "@tanstack/react-query";
import { useContext, useState } from "react";
import { Link } from "react-router-dom";

import { getNeighborhoodMigrations, NeighborhoodContext } from "api";
import { Pager, MigrationList } from "ui";

import { useBgColor } from "utils";

export function Migrations() {
  const { id } = useContext(NeighborhoodContext);
  const [page, setPage] = useState(1);
  const { data, error, isLoading } = useQuery(
    ["neighborhoods", id, "migrations", page],
    getNeighborhoodMigrations(id, { page }),
  );

  console.log(data)

  const bg = useBgColor();

  return (
    <Box my={6} p={6} bg={bg}>
      <Heading size="sm">
        <Text as={Link} color="brand.teal.500" to="/">
          Home
        </Text>{" "}
        / All Migrations
      </Heading>
      <MigrationList
        migrations={data?.items}
        error={error as Error}
        isLoading={isLoading}
      />
      <Pager page={page} setPage={setPage} totalPages={data?.meta.totalPages} />
    </Box>
  );
}
