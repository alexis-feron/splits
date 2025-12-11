"use client";

import type { LatLngExpression } from "leaflet";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

// Fix for default marker icons in Leaflet
import "leaflet/dist/leaflet.css";

// Dynamically import Leaflet components to avoid SSR issues
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

interface CircuitMapProps {
  lat: string;
  long: string;
  circuitName: string;
}

export default function CircuitMap({
  lat,
  long,
  circuitName,
}: CircuitMapProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    // Dynamic import of Leaflet to avoid SSR issues
    import("leaflet").then((L) => {
      // Custom marker icon
      const customIcon = L.icon({
        iconUrl: "/marker.png",
        iconSize: [31, 40],
        iconAnchor: [15.5, 40],
        popupAnchor: [0, -40],
      });

      // Set as default icon
      L.Marker.prototype.options.icon = customIcon;
    });

    // Add custom styles for zoom controls
    const style = document.createElement("style");
    style.innerHTML = `
      .leaflet-control-zoom {
        border: none !important;
        box-shadow: none !important;}
      .leaflet-control-zoom a {
        background-color: white !important;
        color: #374151 !important;
        border: none !important;
        border-radius: 8px !important;
        font-size: 20px !important;
        font-weight: bold !important;
        transition: all 0.2s ease !important;
      }
      .leaflet-control-zoom a:hover {
        background-color: black !important;
        color: white !important;
        transform: scale(1.05);
      }
      .leaflet-control-zoom-in {
        margin-bottom: 8px !important;
      }
      .leaflet-bar {
        border: none !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  if (!isClient) {
    return (
      <div className="w-full h-[300px] bg-gray-200 rounded-xl flex items-center justify-center">
        <span className="text-gray-500">Loading map...</span>
      </div>
    );
  }

  const position: LatLngExpression = [parseFloat(lat), parseFloat(long)];

  return (
    <div className="w-full h-[300px] rounded-xl overflow-hidden shadow-md">
      <MapContainer
        center={position}
        zoom={4}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={false}
        attributionControl={false}
        zoomControl={true}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker position={position}>
          <Popup>
            <strong>{circuitName}</strong>
            <br />
            {lat}, {long}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
