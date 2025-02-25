"use client";

import { useState, useEffect } from "react";
import { VStack, Text, Button, HStack, Icon, Flex, Box, IconButton } from "@chakra-ui/react";
import { FaRoute, FaMapMarkerAlt, FaArrowRight } from "react-icons/fa";
import { useRouter } from "next/navigation";

interface Location {
  id: number;
  lat: number;
  lng: number;
  name: string;
  color: string;
}

const LocationList = () => {
  const router = useRouter();
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedLocationId, setSelectedLocationId] = useState<number | null>(null);

  useEffect(() => {
    const savedLocations = JSON.parse(localStorage.getItem("locations") || "[]");
    setLocations(savedLocations);
  }, []);

  return (
    <VStack w="full" width="100%" p={4} align="center">
      <Text fontSize="2xl" fontWeight="bold" textAlign="center">
        📍 Konum Listesi
      </Text>

      <Button
        top={2}
        colorScheme="blue"
        w="full"
        onClick={() => router.push("/locations/route")}
        disabled={locations.length < 2}
      >
        <HStack>
          <Icon as={FaRoute} />
          <Text>Rota Göster</Text>
        </HStack>
      </Button>

      {locations.length === 0 ? (
        <Text color="gray.500">Henüz konum eklenmemiş.</Text>
      ) : (
        <VStack w="full" gap={2}>
          {locations.map((location) => (
            <Flex
              key={location.id}
              p={5}
              m={1}
              bg="white"
              borderRadius="md"
              boxShadow="md"
              alignItems="center"
              justifyContent="space-between"
              cursor="pointer"
              transition="0.2s"
              _hover={{ transform: "scale(1.02)", bg: "blue.50" }}
              onClick={() => setSelectedLocationId(location.id)}
              w="full"
            >
              <Flex align="center" gap={4} flex="1">
                <Icon as={FaMapMarkerAlt} color={location.color} boxSize={7} />
                <Text fontWeight="medium">{location.name}</Text>
                {selectedLocationId === location.id && (
                  <Box pl={6} borderLeft="2px solid gray">
                    <Text fontSize="sm">📍 Enlem: {location.lat}</Text>
                    <Text fontSize="sm">📍 Boylam: {location.lng}</Text>
                  </Box>
                )}
              </Flex>
              <IconButton
                aria-label="Düzenle"
                colorScheme="blue"
                as={FaArrowRight}
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/locations/edit/${location.id}`);
                }}
              />
            </Flex>
          ))}
        </VStack>
      )}
    </VStack>
  );
};

export default LocationList;
