// src/components/stages/SpotsMap.tsx
'use client';

import type { Spot } from "./SpotsMapClient";

import {
  MapContainer as RLMapContainer,
  TileLayer,
  Marker as RLMarker,
  Popup,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import * as React from "react";

// --- Fix compat TS: versions de react-leaflet qui ne voient pas 'center' / 'icon' ---
// On caste MapContainer et Marker en composants qui acceptent n'importe quel props.
// Cela contourne les incompatibilités de d.ts, sans impacter le runtime.
const MapContainer = RLMapContainer as unknown as React.FC<any>;
const Marker = RLMarker as unknown as React.FC<any>;

type LatLngTuple = [number, number];

const markerIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export default function SpotsMap({ spots = [] }: { spots?: Spot[] }) {
  const safeSpots: Spot[] = Array.isArray(spots) ? spots : [];
  const center: LatLngTuple = [48.8566, 2.3522];
  const hasSpots = safeSpots.length > 0;

  const mapProps = {
    center: hasSpots
      ? ([safeSpots[0].lat, safeSpots[0].lng] as LatLngTuple)
      : center,
    zoom: hasSpots ? 4 : 3,
    className: "h-full w-full",
    scrollWheelZoom: true,
  };

  return (
    <div className="w-full">
      <div className="h-[70vh] w-full overflow-hidden rounded-xl border">
        <MapContainer {...mapProps}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {safeSpots.map((s) => (
            <Marker key={s.id} position={[s.lat, s.lng] as LatLngTuple} icon={markerIcon}>
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
