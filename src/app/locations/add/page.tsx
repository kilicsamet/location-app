"use client";

import { useRouter } from "next/navigation";
import { useLocationStore } from "@/store/useLocationStore";
import { Input, Box, Text, VStack, Button } from "@chakra-ui/react";
import { useEffect } from "react";
import dynamic from "next/dynamic";
const OSMMap = dynamic(() => import("@/components/map/OSMMap"), { ssr: false });
const LocationAddPage = () => {
  const router = useRouter();
  const {
    tempLocation,
    locations,
    locationName,
    markerColor,
    setTempLocation,
    setLocationName,
    setMarkerColor,
    saveLocation
  } = useLocationStore();

  useEffect(() => {
    setLocationName("");
    setMarkerColor("#ff0000");
  }, []);
  
  const handleSaveLocation = () => {
    saveLocation(() => router.push("/locations/list"));
  };

  return (
    <Box maxW={{ base: "100%", md: "container.sm" }} mx="auto" p={4}>
      <Text fontSize="2xl" fontWeight="bold" mb={4} textAlign={"center"}>Konum Ekle</Text>

      {/* Harita */}
      <OSMMap 
        onLocationSelect={setTempLocation} 
        markers={locations} 
        tempMarker={tempLocation ? { ...tempLocation, color: markerColor } : null} 
      />

      <VStack mt={4} gap={3} align="center">
        <Box w={{ base: "100%", sm: "80%", md: "60%" }}>
          <Text fontSize="md" fontWeight="medium" mb={1}>Konum Adı:</Text>
          <Input size="sm"  w={{ base: "50%", sm: "40%", md: "30%" }}  value={locationName} onChange={(e) => setLocationName(e.target.value)} placeholder="Örn: İstanbul Boğazı" />
        </Box>

        <Box w={{ base: "100%", sm: "80%", md: "60%" }}>
          <Text fontSize="md" fontWeight="medium" mb={1}>Marker Rengi:</Text>
          <Input size="sm" w={{ base: "40%", sm: "30%", md: "20%" }} type="color" value={markerColor} onChange={(e) => setMarkerColor(e.target.value)} />
        </Box>

        {/* Konum Ekle Butonu */}
        <Button 
          size="sm"
          w={{ base: "100%", sm: "80%", md: "60%" }}
          colorScheme="blue" 
          onClick={handleSaveLocation} 
          disabled={!tempLocation || !locationName}
        >
          Konumu Ekle
        </Button>
      </VStack>
    </Box>
  );
};

export default LocationAddPage;
