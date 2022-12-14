import {
  Box,
  Flex,
  Spacer,
  Link,
  MenuItem,
  MenuList,
  MenuButton,
  Menu,
  IconButton,
  useDisclosure,
} from "@chakra-ui/react";
import { RiAlignJustify, RiCloseFill } from "react-icons/ri";
import { useLocation } from "react-router-dom";

import Logo from "lib/components/logo/Logo";
import { theme } from "lib/styles/customTheme";

export default function MenuMobile() {
  const { isOpen, onToggle } = useDisclosure();
  const location = useLocation();

  // destructuring pathname from location
  const { pathname } = location;

  // Javascript split method to get the name of the path in array
  const splitLocation = pathname.split("/");

  return (
    <Flex>
      <Logo boxSize="25px" fontSize="1.168rem" fontColor={theme.colors.black} />
      <Spacer />
      <Box display="flex" alignItems="center">
        <Menu>
          <MenuButton
            onClick={onToggle}
            as={IconButton}
            size="lg"
            border="none"
            aria-label="Options"
            icon={isOpen ? <RiCloseFill /> : <RiAlignJustify />}
            variant="outline"
            backgroundColor={theme.colors.cream}
            _active={{ backgroundColor: theme.colors.cream }}
            _hover={{ backgroundColor: theme.colors.cream }}
            _focus={{ backgroundColor: theme.colors.cream }}
            _expanded={{ backgroundColor: theme.colors.cream }}
          />
          <MenuList
            w="100vw"
            alignContent="center"
            backgroundColor={theme.colors.cream}
          >
            <MenuItem
              w="100%"
              h="100%"
              display="flex"
              alignContent="center"
              alignItems="center"
              backgroundColor={theme.colors.cream}
              _active={{ backgroundColor: theme.colors.cream }}
              _hover={{ backgroundColor: theme.colors.cream }}
              _focusVisible={{ backgroundColor: theme.colors.cream }}
              _focus={{ backgroundColor: theme.colors.cream }}
              _expanded={{ backgroundColor: theme.colors.cream }}
            >
              <Link
                w="100%"
                h="100%"
                mt={2}
                mb={2}
                textAlign="center"
                href="/"
                fontWeight={splitLocation[1] === "" ? "bold" : "normal"}
                backgroundColor={theme.colors.cream}
                _active={{ backgroundColor: theme.colors.cream }}
                _hover={{
                  backgroundColor: theme.colors.cream,
                  textDecoration: "none",
                }}
                _focus={{ backgroundColor: theme.colors.cream }}
                _expanded={{ backgroundColor: theme.colors.cream }}
              >
                Blocks
              </Link>
            </MenuItem>
          </MenuList>
        </Menu>
      </Box>
    </Flex>
  );
}
