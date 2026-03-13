import { useContext, useEffect, useState } from "react";
import DarkModeContext from "../DarkModeContext";
import type { PlaceResult } from "./map";

interface PlacesSearchProps {
  onResultsLoaded: (results: PlaceResult[]) => void;
}

export default function PlacesSearch({ onResultsLoaded }: PlacesSearchProps) {
  const [placeName, setPlaceName] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [error, setError] = useState("");
  const darkMode = useContext(DarkModeContext);

  useEffect(() => {
    if (submittedQuery.trim() === "") return;

    console.log("Searching for:", submittedQuery);
    setError("");

    fetch(`https://hikar.org/webapp/nomproxy?q=${encodeURIComponent(submittedQuery)}`)
      .then((response) => {
        console.log("HTTP status:", response.status);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        return response.json();
      })
      .then((json) => {
        console.log("Raw JSON:", json);

        let cleanedResults: PlaceResult[] = [];

        if (Array.isArray(json)) {
          cleanedResults = json
            .map((item: any, index: number): PlaceResult => ({
              id: String(item.place_id ?? item.osm_id ?? index),
              name: item.display_name ?? item.name ?? "Unnamed place",
              lat: Number(item.lat),
              lon: Number(item.lon)
            }))
            .filter(
              (item: PlaceResult) =>
                !Number.isNaN(item.lat) && !Number.isNaN(item.lon)
            );
        } else if (json && Array.isArray(json.features)) {
          cleanedResults = json.features
            .map((feature: any, index: number): PlaceResult => ({
              id: String(
                feature.properties?.place_id ??
                feature.properties?.osm_id ??
                index
              ),
              name:
                feature.properties?.display_name ??
                feature.properties?.name ??
                "Unnamed place",
              lat: Number(
                feature.properties?.lat ??
                feature.geometry?.coordinates?.[1]
              ),
              lon: Number(
                feature.properties?.lon ??
                feature.geometry?.coordinates?.[0]
              )
            }))
            .filter(
              (item: PlaceResult) =>
                !Number.isNaN(item.lat) && !Number.isNaN(item.lon)
            );
        }

        console.log("Cleaned results:", cleanedResults);
        onResultsLoaded(cleanedResults);

        if (cleanedResults.length === 0) {
          setError("No matching places found.");
        }
      })
      .catch((err) => {
        console.error("Search error:", err);
        onResultsLoaded([]);
        setError("Search failed.");
      });
  }, [submittedQuery]);

  return (
    <div
      style={{
        marginBottom: "10px",
        padding: "10px",
        border: `1px solid ${darkMode ? "white" : "black"}`
      }}
    >
      <label htmlFor="place">Enter a place name: </label>
      <input
        id="place"
        value={placeName}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setPlaceName(e.target.value)
        }
      />
      <button onClick={() => setSubmittedQuery(placeName.trim())}>Search</button>

      {error !== "" && <p>{error}</p>}
    </div>
  );
}