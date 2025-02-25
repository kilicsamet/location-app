import { Box, Text } from "@chakra-ui/react";

const Header = () => {
  return (
    <Box 
      bg="gray.700" 
      color="white" 
      p={{ base: "2", md: "4" }} // Mobilde daha küçük padding
      textAlign="center" // İçeriği ortalamak için
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Text fontSize={{ base: "md", md: "xl" }}>Harita Uygulaması</Text>
    </Box>
  );
};

export default Header;
