import { Box, Link } from "@chakra-ui/react";

import Clipboard from "lib/components/clipboard/Clipboard";
import { theme } from "lib/styles/customTheme";
import type LinkTable from "lib/types/linkTable";

interface Props {
  cell: LinkTable | string;
}

const CellTable = ({ cell }: Props) => {
  if (typeof cell !== "string")
    return (
      <Box display="flex" flexDirection="row" alignItems="center">
        <Link color={theme.colors.green} href={cell.link}>
          {cell.value}
        </Link>
        <Clipboard value={cell.value} />
      </Box>
    );
  return <span>{cell}</span>;
};

export default CellTable;
