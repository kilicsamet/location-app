"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useLocationStore } from "@/store/useLocationStore";
import { Box, Text, Input, VStack, Button } from "@chakra-ui/react";
import dynamic from "next/dynamic";
const OSMMapEdit = dynamic(() => import("@/components/map/OSMMapEdit"), { ssr: false });

const EditLocationPage = () => {
  const router = useRouter();
  const { id } = useParams();
  const {
    locations,
    updateLocation,
    locationName,
    markerColor,
    setLocationName,
    setMarkerColor,
    setTempLocation,
    tempLocation,
  } = useLocationStore();

  const [location, setLocation] = useState<{
    id: number;
    name: string;
    color: string;
    lat: number;
    lng: number;
  } | null>(null);

  useEffect(() => {
    if (id) {
      const foundLocation = locations.find((loc) => loc.id === Number(id));

      if (foundLocation) {
        setLocation(foundLocation);
        setLocationName(foundLocation.name);
        setMarkerColor(foundLocation.color);
      }
    }
  }, [id, locations, setLocationName, setMarkerColor]);

  const handleUpdateLocation = () => {
    if (!location) return;

    updateLocation(
      location.id,
      locationName,
      markerColor,
      tempLocation?.lat ?? location.lat,
      tempLocation?.lng ?? location.lng
    );
    router.push("/locations/list");
  };

  if (!location) return <Text>Konum bulunamadı.</Text>;

  return (
    <Box maxW={{ base: "100%", md: "container.sm" }} mx="auto" p={4}>
      <Text fontSize="2xl" fontWeight="bold" mb={4} textAlign={"center"}>
        Konum Güncelle
      </Text>

      <OSMMapEdit
        onLocationSelect={setTempLocation}
        tempMarker={
          tempLocation ? { ...tempLocation, color: markerColor } : null
        }
        location={location}
      />

      <VStack mt={4} gap={3} align="center">
        <Box w={{ base: "100%", sm: "80%", md: "60%" }}>
          <Text fontSize="md" fontWeight="medium" mb={1}>
            Konum Adı:
          </Text>
          <Input
            size="sm"
            w={{ base: "50%", sm: "40%", md: "30%" }}
            value={locationName}
            onChange={(e) => setLocationName(e.target.value)}
            placeholder="Örn: İstanbul Boğazı"
          />
        </Box>

        <Box w={{ base: "100%", sm: "80%", md: "60%" }}>
          <Text fontSize="md" fontWeight="medium" mb={1}>
            Marker Rengi:
          </Text>
          <Input
            size="sm"
            w={{ base: "40%", sm: "30%", md: "20%" }}
            type="color"
            value={markerColor}
            onChange={(e) => setMarkerColor(e.target.value)}
          />
        </Box>

        <Button
          size="sm"
          w={{ base: "100%", sm: "80%", md: "60%" }}
          colorScheme="blue"
          onClick={handleUpdateLocation}
          disabled={!locationName}
        >
          Konumu Güncelle
        </Button>
      </VStack>
    </Box>
  );
};

export default EditLocationPage;
