import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { LatLngExpression, LeafletMouseEvent } from "leaflet";
import { useMapEvents } from "react-leaflet";
import L from "leaflet";

const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then((mod) => mod.Marker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), { ssr: false });
interface Location {
  id?: number;
  lat: number;
  lng: number;
  name?: string;
  color: string;
}

interface OSMMapProps {
  onLocationSelect: (lat: number, lng: number) => void;
  markers: Location[];
  tempMarker?: Location | null; 
}

const DEFAULT_POSITION: LatLngExpression = [41.01, 28.97]; 

const OSMMap = ({ onLocationSelect, markers, tempMarker }: OSMMapProps) => {
  const [tempPosition, setTempPosition] = useState<LatLngExpression | null>(null);

  useEffect(() => {
    if (tempMarker) {
      setTempPosition([tempMarker.lat, tempMarker.lng]);
    }
  }, [tempMarker]);

  return (
    <MapContainer center={tempPosition || DEFAULT_POSITION} zoom={10} style={{ height: "400px", width: "100%" }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {/* Geçici Marker (seçilen renk ile) */}
      {tempMarker && (
        <Marker position={[tempMarker.lat, tempMarker.lng]} icon={customIcon(tempMarker.color)}>
          <Popup>Seçili Konum</Popup>
        </Marker>
      )}

      {markers.map((loc) => (
        <Marker key={loc.id} position={[loc.lat, loc.lng]} icon={customIcon(loc.color)}>
          <Popup>{loc.name}</Popup>
        </Marker>
      ))}

      <MapClickHandler
        onLocationSelect={(lat, lng) => {
          setTempPosition([lat, lng]);
          onLocationSelect(lat, lng);
        }}
      />
    </MapContainer>
  );
};

const MapClickHandler = ({ onLocationSelect }: { onLocationSelect: (lat: number, lng: number) => void }) => {
  
  useMapEvents({
    click(e: LeafletMouseEvent) {
      const { lat, lng } = e.latlng;
      onLocationSelect(lat, lng);
    },
  });

  return null;
};

const customIcon = (color: string) =>
  new L.Icon({
    iconUrl: `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
        <path fill="${color}" stroke="white" stroke-width="2" d="M12 2C8 2 5 5 5 9c0 4 7 11 7 11s7-7 7-11c0-4-3-7-7-7Z"/>
      </svg>`
    )}`,
    iconSize: [32, 32], 
    iconAnchor: [16, 32], 
    popupAnchor: [0, -32], 
  });

export default OSMMap;
