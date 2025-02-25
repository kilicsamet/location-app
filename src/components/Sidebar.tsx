"use client";

import { Box, Stack, Link, Icon, Text, Button } from "@chakra-ui/react";
import {
  FaMapMarkerAlt,
  FaList,
  FaRoute,
  FaBars,
} from "react-icons/fa";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

const Sidebar = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLinkClick = () => {
    if (window.innerWidth < 768) {
      setIsOpen(false);
    }
  };

  const links = [
    { href: "/locations/list", label: "Konumları Listele", icon: FaList },
    { href: "/locations/add", label: "Konum Ekle", icon: FaMapMarkerAlt },
    { href: "/locations/route", label: "Rota Göster", icon: FaRoute },
  ];

  return (
    <>
      <Button
        display={{ base: "block", md: "none" }}
        position="fixed"
        zIndex="1000"
        onClick={() => setIsOpen(!isOpen)}
        bg="gray.700"
        color="white"
        _hover={{ bg: "gray.500" }}
        px={3}
        py={2}
      >
        <Icon as={FaBars} boxSize={4} />
      </Button>

      {/* Sidebar */}
      <Box
        minW={{ base: "full", md: "15%" }}
        maxW="20%"
        bg="gray.900"
        color="white"
        p="6"
        borderRight="1px solid gray"
        boxShadow="lg"
        position={{ base: "fixed", md: "relative" }}
        top="0"
        left={isOpen ? "0" : "-100%"}
        height="100vh"
        zIndex="999"
        transition="left 0.3s ease-in-out"
      >
        <Stack align="start">
          {links.map(({ href, label, icon }) => {
            const isActive = pathname === href;

            return (
              <Link
                key={href}
                as={NextLink}
                href={href}
                display="flex"
                alignItems="center"
                gap={3}
                fontSize="lg"
                fontWeight={isActive ? "bold" : "medium"}
                bg={isActive ? "gray.600" : "transparent"}
                color={isActive ? "white" : "gray.300"}
                px="4"
                py="3"
                borderRadius="md"
                transition="all 0.2s ease-in-out"
                _hover={{ bg: "gray.500", color: "white" }}
                boxShadow={isActive ? "md" : "none"}
                onClick={handleLinkClick} 
              >
                <Icon as={icon} boxSize={5} />
                <Text>{label}</Text>
              </Link>
            );
          })}
        </Stack>
      </Box>
    </>
  );
};

export default Sidebar;
