import { useState } from "react";
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
  const [isActive, setIsActive ] = useState(false)

  const handleClick = () => {
    const active = document.getElementsByClassName("active")[0];
    if (active) {
      active.classList.remove("active");
    }
    setIsActive(true);
  };

if (section) {
    return (
      <ScrollLink 
        to={section}
        spy={false}
        smooth={true}
        offset={-70}
        duration={500}
      >
        <HStack m={0} onClick={handleClick} className={isActive ? "active" : ""}>
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
    <Link 
      href={link}
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
  );
}
}

interface NavProps {
  navItems: NavItemProps[]
}

export function MetricNav({ navItems }: NavProps) {
  return (
    <Stack mt={20}>
      {navItems.map(NavItem)}
    </Stack>
  )
}
