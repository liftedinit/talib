import { useState } from "react";
import { Center, Heading, HStack, Icon, Link as ChakraLink, LinkProps, Text, Stack } from "@liftedinit/ui"
import { IconType } from "@react-icons/all-files"
import { useNavigate, Link as ReactRouterLink } from "react-router-dom";
import { useTopNav } from "api";

interface NavItemProps {
  label: string
  icon?: IconType
  link?: string
  onClick?: () => void;
  isActive?: boolean;
}

export function TopNavItem({ label, link, icon, onClick, isActive}: NavItemProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
    if (link) {
      navigate(link);
    }
  };

  return (
      <Heading lineHeight="67px" size="md" fontWeight="normal" className="top-nav">
        {link ? (
          <ChakraLink 
            as={ReactRouterLink}
            to={link}
            onClick={handleClick}
            className={isActive ? "active" : ""}
          >
            {label}
            { icon ? (
            <Icon
              as={icon}
              aria-label={label}
            />
            ) : null}
          </ChakraLink>
        ) : null }
      </Heading>
  )
}

interface NavProps {
  navItems: NavItemProps[]
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
      })
    )}
  </HStack>
  )
}
