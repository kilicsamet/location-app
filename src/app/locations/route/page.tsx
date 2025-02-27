"use client";

import { useEffect, useState } from "react";
import { useLocationStore } from "@/store/useLocationStore"; 
import { Box, Text } from "@chakra-ui/react";
import dynamic from "next/dynamic";
const OSMMapRoute = dynamic(() => import("@/components/map/OSMMapRoute"), { ssr: false });

const MapComponent = () => {
  const { locations } = useLocationStore();
  const [userLocation, setUserLocation] = useState<[number, number] | null>(
    null
  );
  useEffect(() => {
    // Kullanıcının mevcut konumunu al
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const userCoords: [number, number] = [
          pos.coords.latitude,
          pos.coords.longitude,
        ];
        setUserLocation(userCoords);
      },
      (err) => console.error("Konum alınamadı:", err),
      { enableHighAccuracy: true }
    );
  }, [locations]);

  return (
    <Box maxW={{ base: "100%", md: "container.sm" }} mx="auto" p={4}>
      <Text fontSize="2xl" fontWeight="bold" mb={4} textAlign={"center"}>
        Konumların Rota Çizgileri
      </Text>

      <OSMMapRoute
        markers={locations}
        userLocation={userLocation}
      />
    </Box>
  );
};

export default MapComponent;
