import {
  Box,
  Flex,
  Spacer,
  Link,
  Button,
  MenuItem,
  MenuList,
  MenuButton,
  Menu,
  IconButton,
  MenuDivider,
  useDisclosure,
} from "@chakra-ui/react";
import { RiAlignJustify, RiCloseFill } from "react-icons/ri";

import Logo from "../../../../components/logo/Logo";
import { theme } from "lib/styles/customTheme";

export default function MenuMobile() {
  const { isOpen, onToggle } = useDisclosure();
  return (
    <Flex>
      <Logo boxSize="20px" fontSize="20px" fontColor={theme.colors.black} />
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
            >
              <Link
                w="100%"
                h="100%"
                fontWeight="bold"
                mt={2}
                mb={2}
                textAlign="center"
                _hover={{ textDecoration: "none" }}
              >
                Blocks
              </Link>
            </MenuItem>
            <MenuItem>
              <Link
                w="100%"
                mt={2}
                mb={2}
                textAlign="center"
                _hover={{ textDecoration: "none" }}
              >
                Nodes
              </Link>
            </MenuItem>
            <MenuDivider />
            <Box display="flex" flexDirection="column" px="10%">
              <Button mt={5} colorScheme="teal" variant="solid">
                Sign Up
              </Button>
              <Button mt={5} mb={5} colorScheme="teal" variant="outline">
                Sign In
              </Button>
            </Box>
          </MenuList>
        </Menu>
      </Box>
    </Flex>
  );
}
