import { useColorMode, IconButton } from "@chakra-ui/react";
import { FaMoon } from '@react-icons/all-files/fa/FaMoon';

export function DarkModeToggle() {
  const { colorMode, toggleColorMode } = useColorMode()
  return (
      <IconButton 
        onClick={toggleColorMode} 
        icon={<FaMoon />}
        aria-label="Dark Mode"
        variant="link"
      >
        {colorMode === 'dark' ? 'Light' : 'Dark'}
      </IconButton>
  )
}