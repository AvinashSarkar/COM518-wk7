import { useEffect, useRef } from "react";
import * as L from "leaflet";
import "leaflet/dist/leaflet.css";

export interface PlaceResult {
  id: string;
  name: string;
  lat: number;
  lon: number;
}

interface MapProps {
  lat: number;
  lon: number;
  results: PlaceResult[];
  onMapMoved: (lat: number, lon: number) => void;
}

export default function Map({ lat, lon, results, onMapMoved }: MapProps) {
  const mapDiv = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  // Initialise map once
  useEffect(() => {
    if (mapDiv.current && mapRef.current === null) {
      mapRef.current = L.map(mapDiv.current);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "Copyright OSM contributors, ODBL"
      }).addTo(mapRef.current);

      mapRef.current.setView([lat, lon], 13);

      markersLayerRef.current = L.layerGroup().addTo(mapRef.current);

      mapRef.current.on("moveend", () => {
        if (mapRef.current) {
          const centre = mapRef.current.getCenter();
          onMapMoved(centre.lat, centre.lng);
        }
      });
    }
  }, []);

  // Re-centre map when props change
  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.setView([lat, lon], mapRef.current.getZoom());
    }
  }, [lat, lon]);

  // Update markers whenever results change
  useEffect(() => {
    if (!markersLayerRef.current) return;

    markersLayerRef.current.clearLayers();

    results.forEach((result) => {
      const marker = L.marker([result.lat, result.lon]);
      marker.bindPopup(result.name);
      marker.addTo(markersLayerRef.current!);
    });
  }, [results]);

  return <div ref={mapDiv} style={{ width: "800px", height: "500px" }}></div>;
}