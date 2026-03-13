import { useContext } from "react";
import DarkModeContext from "../DarkModeContext";
import type { PlaceResult } from "./map";

interface SearchResultsProps {
  results: PlaceResult[];
  onGoToLocation: (lat: number, lon: number) => void;
}

export default function SearchResults({
  results,
  onGoToLocation
}: SearchResultsProps) {
  const darkMode = useContext(DarkModeContext);

  const resultsJSX = results.map((result) => (
    <li key={result.id} style={{ marginBottom: "8px" }}>
      {result.name}
      <br />
      <button onClick={() => onGoToLocation(result.lat, result.lon)}>
        Go to this location
      </button>
    </li>
  ));

  return (
    <div
      style={{
        marginTop: "10px",
        width: "800px",
        maxHeight: "250px",
        overflow: "auto",
        border: `1px solid ${darkMode ? "white" : "black"}`,
        padding: "10px"
      }}
    >
      <h3>Search results</h3>
      {results.length === 0 ? <p>No results yet.</p> : <ul>{resultsJSX}</ul>}
    </div>
  );
}