// components/stages/SpotsMap.tsx
"use client";

import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import type { LatLngExpression } from "leaflet";
import L from "leaflet";
import type { Spot } from "./SpotsMapClient";

const markerIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export default function SpotsMap({ spots = [] }: { spots?: Spot[] }) {
  const safeSpots: Spot[] = Array.isArray(spots) ? spots : [];
  const center: LatLngExpression = [48.8566, 2.3522];
  const hasSpots = safeSpots.length > 0;

  return (
    <div className="w-full">
      <div className="h-[70vh] w-full overflow-hidden rounded-xl border">
        <MapContainer
          center={
            hasSpots
              ? ([safeSpots[0].lat, safeSpots[0].lng] as LatLngExpression)
              : center
          }
          zoom={hasSpots ? 4 : 3}
          className="h-full w-full"
          scrollWheelZoom
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {safeSpots.map((s) => (
            <Marker key={s.id} position={[s.lat, s.lng]} icon={markerIcon}>
              <Popup>
                <div className="space-y-1 max-w-[260px]">
                  <div className="font-semibold">
                    {s.title || s.companyName}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {[s.companyName, s.address].filter(Boolean).join(" · ")}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {[s.city, s.countryName].filter(Boolean).join(", ")}
                  </div>

                  {s.description && (
                    <p className="text-sm mt-2">
                      {s.description.length > 140
                        ? s.description.slice(0, 140) + "…"
                        : s.description}
                    </p>
                  )}

                  <div className="pt-2 text-sm space-x-3">
                    {s.website && (
                      <a
                        href={s.website}
                        target="_blank"
                        rel="noreferrer"
                        className="text-amber-700 hover:underline"
                      >
                        Site web
                      </a>
                    )}
                    {s.contactEmail && (
                      <a
                        href={`mailto:${s.contactEmail}`}
                        className="text-amber-700 hover:underline"
                      >
                        Contact
                      </a>
                    )}
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
