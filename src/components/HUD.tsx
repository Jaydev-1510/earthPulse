import type { LayerVisibility, AuroraState, ISSPosition } from "../types";

interface HUDProps {
  eqCount: number;
  maxMag: string;
  iss: ISSPosition | null;
  aurora: AuroraState | null;
  layers: LayerVisibility;
  onToggle: (layer: keyof LayerVisibility) => void;
}

const LAYERS: Array<{
  key: keyof LayerVisibility;
  label: string;
  color: string;
}> = [
  { key: "earthquakes", label: "Earthquakes", color: "#e24b4a" },
  { key: "volcanoes", label: "Volcanoes", color: "#ef9f27" },
  { key: "iss", label: "ISS track", color: "#ffffff" },
  { key: "aurora", label: "Aurora", color: "#7f77dd" },
  { key: "heatmap", label: "Heatmap", color: "#378add" },
];

export function HUD({
  eqCount,
  maxMag,
  iss,
  aurora,
  layers,
  onToggle,
}: HUDProps) {
  return (
    <>
      <div className="hud-pills">
        <div className="hud-pill">
          <span className="hud-dot" style={{ background: "#e24b4a" }} />
          <span>{eqCount} quakes</span>
        </div>
        <div className="hud-pill">
          <span className="hud-dot" style={{ background: "#e24b4a" }} />
          <span>Max M{maxMag}</span>
        </div>
        {iss && (
          <div className="hud-pill">
            <span className="hud-dot" style={{ background: "#5dcaa5" }} />
            <span>
              ISS {iss.lat.toFixed(1)}° {iss.lng.toFixed(1)}°
            </span>
          </div>
        )}
        {aurora && (
          <div className="hud-pill">
            <span className="hud-dot" style={{ background: "#7f77dd" }} />
            <span>
              Kp {aurora.kpIndex.toFixed(1)} · {aurora.level}
            </span>
          </div>
        )}
      </div>
      <div className="layer-panel">
        <h1 className="layer-panel-title">Layers -</h1>
        {LAYERS.map((l) => (
          <button
            key={l.key}
            className={`layer-btn ${layers[l.key] ? "active" : "inactive"}`}
            onClick={() => onToggle(l.key)}
          >
            <span
              className="layer-dot"
              style={{ background: layers[l.key] ? l.color : "#1e3050" }}
            />
            {l.label}
          </button>
        ))}
      </div>
    </>
  );
}
