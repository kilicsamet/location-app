import React, { useState, useMemo, useEffect } from "react";
import dynamic from "next/dynamic";
import L from "leaflet";
import { Polyline, useMap, useMapEvent } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Box, Text } from "@chakra-ui/react";

const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
  ssr: false,
});

interface Location {
  id?: number;
  lat: number;
  lng: number;
  name?: string;
  color: string;
}

interface OSMMapProps {
  markers: Location[];
  userLocation: [number, number] | null;
}

const userLocationIcon = L.divIcon({
  className: "custom-marker",
  html: `<div style="
    background: #4A90E2;
    border-radius: 50%;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  ">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
    </svg>
  </div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const haversineDistance = (
  coord1: [number, number],
  coord2: [number, number]
): number => {
  const toRad = (x: number): number => (x * Math.PI) / 180;
  const R = 6371; // Dünya yarıçapı (km)
  const dLat = toRad(coord2[0] - coord1[0]);
  const dLng = toRad(coord2[1] - coord1[1]);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(coord1[0])) *
      Math.cos(toRad(coord2[0])) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const sortLocationsByProximity = (
  userLocation: [number, number] | null,
  locations: Location[]
): Location[] => {
  if (!userLocation) return locations;
  return [...locations].sort(
    (a, b) =>
      haversineDistance(userLocation, [a.lat, a.lng]) -
      haversineDistance(userLocation, [b.lat, b.lng])
  );
};

const OSMMapRoute = ({ markers, userLocation }: OSMMapProps) => {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null
  );

  const sortedMarkers = useMemo(
    () => sortLocationsByProximity(userLocation, markers),
    [userLocation, markers]
  );

  const routeCoords: L.LatLng[] = userLocation
    ? [
        L.latLng(userLocation[0], userLocation[1]),
        ...sortedMarkers.map((m) => L.latLng(m.lat, m.lng)),
      ]
    : sortedMarkers.map((m) => L.latLng(m.lat, m.lng));

  const center = userLocation || [41, 29];
  const memoizedIcons = useMemo(() => {
    return markers.reduce((acc, loc) => {
      acc[loc.color] =
        acc[loc.color] ||
        new L.Icon({
          iconUrl: `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
            `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
              <path fill="${loc.color}" stroke="white" stroke-width="2" d="M12 2C8 2 5 5 5 9c0 4 7 11 7 11s7-7 7-11c0-4-3-7-7-7Z"/>
            </svg>`
          )}`,
          iconSize: [32, 32],
          iconAnchor: [16, 32],
          popupAnchor: [0, -32],
        });
      return acc;
    }, {} as Record<string, L.Icon>);
  }, [markers]);

  const memoizedLineColors = (routeLat: number, routeLng: number) => {
    const matchedMarker = markers.find(
      (marker) => marker.lat === routeLat && marker.lng === routeLng
    );
    return matchedMarker?.color;
  };

  const memoizedLineMarkers = (routeLat: number, routeLng: number) => {
    const matchedMarker = markers.find(
      (marker) => marker.lat === routeLat && marker.lng === routeLng
    );
    return matchedMarker;
  };

  return (
    <>
      <MapContainer
        center={center}
        zoom={11}
        style={{ height: "400px", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        <MapUpdater center={center} />
        <MapClickHandler onMapClick={() => setSelectedLocation(null)} />

        {userLocation && (
          <Marker
            position={userLocation}
            icon={userLocationIcon}
            eventHandlers={{
              click: () =>
                setSelectedLocation({
                  id: 1,
                  color: "#ffff",
                  lat: userLocation[0],
                  lng: userLocation[1],
                  name: "Mevcut Konumunuz",
                }),
            }}
          >
            <Popup>Mevcut Konumunuz</Popup>
          </Marker>
        )}

        {markers.map((loc) => (
          <Marker
            key={loc.id}
            position={[loc.lat, loc.lng]}
            icon={memoizedIcons[loc.color]}
            eventHandlers={{
              click: () => setSelectedLocation(loc),
            }}
          >
            <Popup>{loc.name}</Popup>
          </Marker>
        ))}

        {routeCoords.length > 1 &&
          routeCoords.slice(1).map((coord, index) => {
            const prevCoord = routeCoords[index];
            const nextCoord = routeCoords[index + 1];
            const markerColor = memoizedLineColors(nextCoord.lat, nextCoord.lng) || "blue";
            const LocationDetail = memoizedLineMarkers(nextCoord.lat, nextCoord.lng) || null ;

            return (
              <React.Fragment key={index}>
                {/* Çizgi */}
                <Polyline
                  positions={[prevCoord, coord]}
                  pathOptions={{
                    color: markerColor,
                    weight: 6,
                    dashArray: "5, 10",
                    dashOffset: "10",
                  }}
                />

                {/* Orta noktada numara etiketi */}
                <Marker
                  position={nextCoord}
                  icon={customNumberIcon(index + 1, markerColor)}
                  eventHandlers={{
                    click: () => setSelectedLocation(LocationDetail),
                  }}
                >
                  
                </Marker>
              </React.Fragment>
            );
          })}
      </MapContainer>

      {selectedLocation && (
        <Box bg="white" p={4} borderRadius="md" boxShadow="md" mt={2}>
          <Text fontSize="lg" fontWeight="bold">
            Seçili Konum Bilgisi
          </Text>
          <Text>
            <strong>Adı:</strong> {selectedLocation.name}
          </Text>
          <Text>
            <strong>Koordinatlar:</strong> {selectedLocation.lat},{" "}
            {selectedLocation.lng}
          </Text>
        </Box>
      )}
    </>
  );
};

// Harita merkezini güncelleyen bileşen
const MapUpdater = ({ center }: { center: [number, number] }) => {
  const map = useMap();

  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);

  return null;
};

// Haritaya tıklanınca seçili konumu sıfırlayan bileşen
const MapClickHandler = ({ onMapClick }: { onMapClick: () => void }) => {
  useMapEvent("click", onMapClick);
  return null;
};
const customNumberIcon = (number: number, color: string) =>
  L.divIcon({
    className: "custom-marker",
    html: `<div style="
      background:${color};
      opacity: 0.8;
       position: relative;
      top:8px;
      color: white;
      font-weight: bold;
      border-radius: 50%;
      width: 25px;
      height: 25px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
    ">${number}</div>`,
    iconSize: [25, 25],
  });

export default OSMMapRoute;
