import { useState } from "react";
import DarkModeContext from "./DarkModeContext";
import Map, { PlaceResult } from "./Components/map";
import PlacesSearch from "./Components/PlacesSearch";
import SearchResults from "./Components/SearchResults";
import ModeChooser from "./Components/ModeChooser";

export default function App() {
  const [lat, setLat] = useState(51.05);
  const [lon, setLon] = useState(-0.72);
  const [results, setResults] = useState<PlaceResult[]>([]);
  const [mode, setMode] = useState("light");

  const darkMode = mode === "dark";
  const background = darkMode ? "black" : "white";
  const foreground = darkMode ? "white" : "black";

  function updateMapPosition(newLat: number, newLon: number) {
    setLat(newLat);
    setLon(newLon);
  }

  function updateResults(newResults: PlaceResult[]) {
    setResults(newResults);
  }

  function goToLocation(newLat: number, newLon: number) {
    setLat(newLat);
    setLon(newLon);
  }

  return (
    <DarkModeContext.Provider value={darkMode}>
      <div
        style={{
          backgroundColor: background,
          color: foreground,
          minHeight: "100vh",
          padding: "10px"
        }}
      >
        <h1>Leaflet React App</h1>

        <p>
          Map centre: {lat.toFixed(4)}, {lon.toFixed(4)}
        </p>

        <ModeChooser mode={mode} modeUpdated={setMode} />

        <PlacesSearch onResultsLoaded={updateResults} />

        <Map
          lat={lat}
          lon={lon}
          results={results}
          onMapMoved={updateMapPosition}
        />

        <SearchResults
          results={results}
          onGoToLocation={goToLocation}
        />
      </div>
    </DarkModeContext.Provider>
  );
}