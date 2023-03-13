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
import { getNeighborhoods } from "../queries";
import { NeighborhoodContext } from "./provider";

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
  const activeIndex = neighborhoods.findIndex((n) => n.id === id);
  const active = neighborhoods[activeIndex === -1 ? 0 : activeIndex];

  return (
    <Menu>
      <MenuButton
        as={Button}
        rightIcon={<ChevronDownIcon />}
        variant="outline"
        colorScheme="brand.black"
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
