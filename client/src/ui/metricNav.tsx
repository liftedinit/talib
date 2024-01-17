import { Center, HStack, Icon, Link, Text, Stack } from "@liftedinit/ui"
import { IconType } from "@react-icons/all-files"
import { Link as ScrollLink, animateScroll as scroll } from "react-scroll";

interface NavItemProps {
  section?: string
  label: string
  icon: IconType
  link?: string
}

export function NavItem({ section, link, label, icon }: NavItemProps) {

if (section) {
    return (
      <ScrollLink 
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
      </ScrollLink>
    );
} else if (link) {
  return (
    <Link href={link}>
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
  );
}
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
