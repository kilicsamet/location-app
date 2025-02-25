"use client";

import { create } from "zustand";

const getStoredLocations = () => {
  if (typeof window === "undefined") return []; 
  const data = localStorage?.getItem("locations");
  return data ? JSON.parse(data) : [];
};

interface Location {
  id: number;
  lat: number;
  lng: number;
  name: string;
  color: string;
}

interface LocationState {
  tempLocation: { lat: number; lng: number } | null;
  locations: Location[];
  locationName: string;
  markerColor: string;
  setTempLocation: (lat: number, lng: number) => void;
  setLocationName: (name: string) => void;
  setMarkerColor: (color: string) => void;
  saveLocation: (callback: () => void) => void;
  updateLocation: (id: number, name: string, color: string,lat: number, lng: number) => void; 
}

export const useLocationStore = create<LocationState>((set) => ({
  tempLocation: null,
  locations: getStoredLocations(),
  locationName: "",
  markerColor: "#ff0000",
  setTempLocation: (lat, lng) => set({ tempLocation: { lat, lng } }),
  setLocationName: (name) => set({ locationName: name }),
  setMarkerColor: (color) => set({ markerColor: color }),

  saveLocation: (callback) =>
    set((state) => {
      if (!state.tempLocation || !state.locationName) return state;

      const newLocation: Location = {
        id: Date.now(),
        lat: state.tempLocation.lat,
        lng: state.tempLocation.lng,
        name: state.locationName,
        color: state.markerColor,
      };

      const updatedLocations = [...state.locations, newLocation];

      localStorage.setItem("locations", JSON.stringify(updatedLocations));
      callback();

      return {
        ...state,
        locations: updatedLocations,
        tempLocation: null,
        locationName: "",
        markerColor: "#ff0000", // Marker rengini varsayılan değere sıfırla
      };
    }),

  updateLocation: (id, name, color, lat, lng) =>
    set((state) => {
      const updatedLocations = state.locations.map((loc) =>
        loc.id === id ? { ...loc, name, color, lat, lng } : loc
      );

      localStorage.setItem("locations", JSON.stringify(updatedLocations));

      return {
        ...state,
        locations: updatedLocations,
        tempLocation: null,
        locationName: "", 
        markerColor: "#ff0000", 
      };
    }),
}));


