import { Center, HStack, Icon, Text, Stack } from "@liftedinit/ui"
import { IconType } from "@react-icons/all-files"
import { Link, animateScroll as scroll } from "react-scroll";

interface NavItemProps {
  section: string
  label: string
  icon: IconType
}

export function NavItem({ section, label, icon }: NavItemProps) {

  return (
    <Link 
      to={section}
      activeClass="active"
      spy={true}
      smooth={true}
      offset={-70}
      duration={500}
    >
      <HStack m={0}>
        <Center p={3}>
          <Icon
            as={icon}
            aria-label={label}
          />
        </Center>
        <Text >{label}</Text>
      </HStack>
    </Link>
  )
}

interface NavProps {
  navItems: NavItemProps[]
}

export function MetricNav({ navItems }: NavProps) {
  return (
    <Stack >
      {navItems.map(NavItem)}
    </Stack>
  )
}