import { useState, useCallback } from "react";
import { Globe } from "./components/globe";
import { Sidebar } from "./components/sidebar";
import { HUD } from "./components/HUD";
import { EventDetail } from "./components/eventDetail";
import { StatusBar } from "./components/statusBar";
import { useEarthPulseData } from "./hooks/useEarthPulseData";
import type { FeedEvent, LayerVisibility } from "./types";

const DEFAULT_LAYERS: LayerVisibility = {
  earthquakes: true,
  volcanoes: true,
  iss: true,
  aurora: true,
  tsunami: false,
  solar: false,
  heatmap: false,
};

export function App() {
  const data = useEarthPulseData();

  const [layers, setLayers] = useState<LayerVisibility>(DEFAULT_LAYERS);
  const [selected, setSelected] = useState<FeedEvent | null>(null);
  const [flyTarget, setFlyTarget] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const handleToggle = useCallback((key: keyof LayerVisibility) => {
    setLayers((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const handleSelect = useCallback((ev: FeedEvent) => {
    setSelected(ev);
    setFlyTarget({ lat: ev.lat, lng: ev.lng - 90 });
  }, []);

  const handleClose = useCallback(() => {
    setSelected(null);
  }, []);

  if (data.loading) {
    return (
      <div className="loading-screen">
        <div className="loading-logo">
          🌎 Earth <span>Pulse</span>
        </div>
        <div className="loading-spinner" />
        <div className="loading-track">
          <div className="loading-fill" style={{ width: "60%" }} />
        </div>
        <div className="loading-msg">Loading textures... Fetching data...</div>
      </div>
    );
  }

  return (
    <div className="app">
      <div className="globe-wrap">
        <Globe
          earthquakes={data.earthquakes}
          volcanoes={data.volcanoes}
          iss={data.iss}
          issTrail={data.issTrail}
          aurora={data.aurora}
          layers={layers}
          flyTarget={flyTarget}
          onEventClick={handleSelect}
        />
        <HUD
          eqCount={data.eqCount}
          maxMag={data.maxMag}
          iss={data.iss}
          aurora={data.aurora}
          layers={layers}
          onToggle={handleToggle}
        />
        {selected && <EventDetail event={selected} onClose={handleClose} />}
      </div>

      <Sidebar
        earthquakes={data.earthquakes}
        volcanoes={data.volcanoes}
        iss={data.iss}
        onSelect={handleSelect}
        selectedId={selected?.id ?? null}
      />

      <StatusBar
        eqCount={data.eqCount}
        maxMag={data.maxMag}
        volCount={data.volcanoes.length}
        iss={data.iss}
        aurora={data.aurora}
        eqError={data.eqError}
      />
    </div>
  );
}
