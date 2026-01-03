"use client";

import { MapContainer, TileLayer, CircleMarker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export default function MapContent({ onSelect }) {
  const ClickListener = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        console.log("Map clicked at:", lat, lng);

        if (onSelect) {
          onSelect({
            name: `Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
            address: `${lat}, ${lng}`,
            lat,
            lon: lng,
            city: "",
          });
        }
      },
    });
    return null;
  };

  return (
    <MapContainer
      center={[20.5937, 78.9629]}
      zoom={4}
      style={{ width: "100%", height: "100%" }}
      key="map-container"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <CircleMarker
        center={[20.5937, 78.9629]}
        radius={5}
        fillColor="blue"
        color="blue"
        weight={2}
        opacity={1}
        fillOpacity={0.8}
      >
        <Popup>India Center</Popup>
      </CircleMarker>
      <ClickListener />
    </MapContainer>
  );
}
