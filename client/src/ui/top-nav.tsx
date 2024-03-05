import React, { useState } from "react";
import {
  Center,
  Collapse,
  SlideFade,
  Heading,
  HStack,
  Icon,
  Link as ChakraLink,
  StackDivider,
  LinkProps,
  Text,
  Stack,
  
  Box,
  VStack,
} from "@liftedinit/ui";
import { IconType } from "@react-icons/all-files";
import { useNavigate, Link as ReactRouterLink } from "react-router-dom";
import { useTopNav } from "api";
import { useNavBgColor } from "utils";

interface NavItemProps {
  label: string;
  icon?: IconType;
  link?: string;
  onClick?: () => void;
  isActive?: boolean;
  dropdownItems?: NavItemProps[]; // Add dropdownItems property
}

export function TopNavItem({
  label,
  link,
  icon,
  onClick,
  isActive,
  dropdownItems,
}: NavItemProps) {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const bg = useNavBgColor();

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
    if (link) {
      navigate(link);
    }
  };

  const handleDropdownClick = (itemLink: string) => {
    navigate(itemLink);
    setIsDropdownOpen(false);
  };

  const handleMouseEnter = () => {
    setIsDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    setIsDropdownOpen(false);
  };

  return (
    <Box
      position="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Heading lineHeight="67px" size="md" fontWeight="normal" className="top-nav">
        {link ? (
          <ChakraLink
            as={ReactRouterLink}
            to={link}
            onClick={handleClick}
            className={isActive ? "active" : ""}
          >
            {label}
            {icon ? <Icon as={icon} aria-label={label} /> : null}
          </ChakraLink>
        ) : null}
      </Heading>
      <SlideFade in={isDropdownOpen}>
      {dropdownItems && (
        <VStack
          position="absolute"
          top="100%"
          zIndex="1"
          bg={bg}
          boxShadow="lg"
          spacing={2}
          py={2}
          align="start"
          className="top-nav-dropdown"
        >
          {dropdownItems.map((item, index) => (
            <Box pl={4} pr={8} py={2}>
              <Text fontSize='md'>
                <ChakraLink
                  key={index}
                  as={ReactRouterLink}
                  to={item.link ? item.link : ""}
                  onClick={() => handleDropdownClick(item.link || "")}
                >
                  {item.label}
                </ChakraLink>
              </Text>
            </Box>
          ))}
        </VStack>
      )}
    </SlideFade>
    </Box>
  );
}

interface NavProps {
  navItems: NavItemProps[];
}

export function TopNav({ navItems }: NavProps) {
  const { activeIndex, handleItemClick } = useTopNav();

  return (
    <HStack>
      {navItems.map((item, index) =>
        TopNavItem({
          label: item.label,
          icon: item.icon,
          link: item.link,
          onClick: () => handleItemClick(index),
          isActive: index === activeIndex,
          dropdownItems: item.dropdownItems, // Pass dropdownItems to TopNavItem
        })
      )}
    </HStack>
  );
}
