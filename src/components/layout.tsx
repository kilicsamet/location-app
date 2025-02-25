import { ReactNode } from "react";
import { Box, Flex } from "@chakra-ui/react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";


interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <Flex h="100vh">
      {/* Sol Menü */}
      <Sidebar />

      <Flex flex="1" direction="column">
        {/* Üst Header */}
        <Header />

        {/* İçerik Alanı */}
        <Box flex="1" p="4" bg="gray.100">
          {children}
        </Box>
      </Flex>
    </Flex>
  );
};

export default Layout;
