import React, { useState } from "react";
import { Center, HStack, Icon, Link, Text, Stack } from "@liftedinit/ui"
import { IconType } from "@react-icons/all-files"
import { Link as ScrollLink, animateScroll as scroll } from "react-scroll";

interface NavItemProps {
  section?: string
  label: string
  icon: IconType
  link?: string
  onClick?: () => void;
  isActive?: boolean;
}

export function NavItem({ section, link, label, icon, onClick, isActive }: NavItemProps) {

  if (!section) {
    return null; 
  }

  if (section) {
      return (
        <ScrollLink 
          to={section}
          spy={false}
          smooth={true}
          offset={-70}
          duration={500}
          onClick={() => {
            if (onClick) {
              onClick();
            }
          }}
          className={isActive ? "active" : ""}
        >
          <HStack m={0} >
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
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const handleItemClick = (index: number) => {
    setActiveIndex(index);
  };

  return (
  <Stack mt={20}>
    {navItems.map((item, index) =>
      NavItem({
        section: item.section,
        label: item.label,
        icon: item.icon,
        onClick: () => handleItemClick(index),
        isActive: index === activeIndex,
      })
    )}
  </Stack>
  )
}
