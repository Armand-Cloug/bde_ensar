// app/(public)/stages/SpotsMap.tsx
"use client";

import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import type { LatLngExpression } from "leaflet";
import L from "leaflet";

// Icône Leaflet (évite le bug des assets avec Next.js)
const markerIcon = L.icon({
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

type Spot = {
  id: string;
  lat: number;
  lng: number;
  companyName: string;
  city?: string | null;
  countryName?: string | null;
};

export default function SpotsMap({ spots = [] }: { spots?: Spot[] }) {
  // Garde-fou : s'assurer d'avoir un tableau
  const safeSpots: Spot[] = Array.isArray(spots) ? spots : [];

  // Centre initial (Europe)
  const center: LatLngExpression = [48.8566, 2.3522];
  const hasSpots = safeSpots.length > 0;

  return (
    <div className="w-full">
      <div className="h-[70vh] w-full overflow-hidden rounded-xl border">
        <MapContainer
          center={hasSpots ? ([safeSpots[0].lat, safeSpots[0].lng] as LatLngExpression) : center}
          zoom={hasSpots ? 4 : 3}
          className="h-full w-full"
          scrollWheelZoom
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {safeSpots.map((s) => (
            <Marker key={s.id} position={[s.lat, s.lng]} icon={markerIcon}>
              <Popup>
                <div className="space-y-1">
                  <div className="font-medium">{s.companyName}</div>
                  <div className="text-sm text-muted-foreground">
                    {[s.city, s.countryName].filter(Boolean).join(", ")}
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {!hasSpots && (
        <p className="text-sm text-muted-foreground mt-2">
          Aucun stage validé à afficher pour le moment.
        </p>
      )}
    </div>
  );
}
