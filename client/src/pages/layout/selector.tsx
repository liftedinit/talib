import {
  Button,
  ChevronDownIcon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  MenuOptionGroup,
  Spinner,
  Text,
} from "@liftedinit/ui";
import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";

import { getNeighborhoods, NeighborhoodContext } from "api";

interface Neighborhood {
  name: string;
  id: number;
}

export function NeighborhoodSelector() {
  const { id, setId } = useContext(NeighborhoodContext);
  const { data } = useQuery(["neighborhoods"], getNeighborhoods());

  if (!data) {
    return <Spinner />;
  }

  const neighborhoods: Neighborhood[] = data;
  const active = neighborhoods.filter((n) => n.id === id)[0];
  if (!active) {
    setId(neighborhoods[0].id);
    return <Spinner />;
  }

  return (
    <Menu>
      <MenuButton
        as={Button}
        rightIcon={<ChevronDownIcon />}
        variant="outline"
        colorScheme="brand.white"
        size="sm"
      >
        <Text>{active.name}</Text>
      </MenuButton>
      <MenuList>
        <MenuOptionGroup title="Neighborhoods" />
        {neighborhoods.map((n) => (
          <MenuItem key={n.id} onClick={() => setId(n.id)}>
            {n.name}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
}
