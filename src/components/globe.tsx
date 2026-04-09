import { useRef, useEffect, useMemo, useCallback } from "react";
import GlobeGL from "react-globe.gl";
import type {
  Earthquake,
  Volcano,
  ISSPosition,
  AuroraState,
  LayerVisibility,
  FeedEvent,
} from "../types";
import { magColor, magRadius } from "../data/usgs";
import { volColor } from "../data/volcanoes";
import { kpToOpacity, kpToColor } from "../data/noaa";

const DAY_TEXTURE =
  "https://unpkg.com/three-globe@2.45.2/example/img/earth-blue-marble.jpg";
const BUMP_TEXTURE =
  "https://cdn.jsdelivr.net/gh/mrdoob/three.js@r128/examples/textures/planets/earth_normal_2048.jpg";

const AURORA_RINGS = [
  { lat: 66.5, lng: 0 },
  { lat: 66.5, lng: 90 },
  { lat: 66.5, lng: 180 },
  { lat: 66.5, lng: -90 },
  { lat: -66.5, lng: 0 },
  { lat: -66.5, lng: 90 },
  { lat: -66.5, lng: 180 },
  { lat: -66.5, lng: -90 },
];

interface GlobeProps {
  earthquakes: Earthquake[];
  volcanoes: Volcano[];
  iss: ISSPosition | null;
  issTrail: ISSPosition[];
  aurora: AuroraState | null;
  layers: LayerVisibility;
  flyTarget: { lat: number; lng: number } | null;
  onEventClick: (event: FeedEvent) => void;
}

export function Globe({
  earthquakes,
  volcanoes,
  iss,
  issTrail,
  aurora,
  layers,
  flyTarget,
  onEventClick,
}: GlobeProps) {
  const globeRef = useRef<any>(null);

  useEffect(() => {
    if (!flyTarget || !globeRef.current) return;
    globeRef.current.pointOfView(
      { lat: flyTarget.lat, lng: flyTarget.lng, altitude: 1.8 },
      1000,
    );
  }, [flyTarget]);

  const pointsData = useMemo(() => {
    const pts: any[] = [];
    if (layers.earthquakes) {
      earthquakes.forEach((eq) =>
        pts.push({
          lat: eq.lat,
          lng: eq.lng,
          radius: magRadius(eq.magnitude),
          color: magColor(eq.magnitude),
          altitude: 0.005,
          kind: "earthquake",
          raw: eq,
        }),
      );
    }
    if (layers.volcanoes) {
      volcanoes.forEach((v) =>
        pts.push({
          lat: v.lat,
          lng: v.lng,
          radius: v.status === "erupting" ? 0.7 : 0.45,
          color: volColor(v.status),
          altitude: 0.005,
          kind: "volcano",
          raw: v,
        }),
      );
    }
    if (layers.iss && iss) {
      pts.push({
        lat: iss.lat,
        lng: iss.lng,
        radius: 0.55,
        color: "#5dcaa5",
        altitude: 0.025,
        kind: "iss",
        raw: iss,
      });
    }
    return pts;
  }, [earthquakes, volcanoes, iss, layers]);

  const ringsData = useMemo(() => {
    const rings: any[] = [];
    if (layers.earthquakes) {
      earthquakes
        .filter((eq) => eq.magnitude >= 5.0)
        .forEach((eq) =>
          rings.push({
            lat: eq.lat,
            lng: eq.lng,
            maxR: eq.magnitude * 1.2,
            propagationSpeed: 1.5,
            repeatPeriod: 1200,
            color: magColor(eq.magnitude),
          }),
        );
    }
    if (layers.aurora && aurora) {
      AURORA_RINGS.forEach((r) =>
        rings.push({
          lat: r.lat,
          lng: r.lng,
          maxR: 18,
          propagationSpeed: 0.6,
          repeatPeriod: 2500,
          color: kpToColor(aurora.kpIndex),
        }),
      );
    }
    return rings;
  }, [earthquakes, aurora, layers]);

  const pathsData = useMemo(() => {
    if (!layers.iss || issTrail.length < 2) return [];
    return [
      {
        coords: issTrail.map((p) => [p.lat, p.lng]),
        color: ["#5dcaa5cc", "#5dcaa500"],
      },
    ];
  }, [issTrail, layers.iss]);

  const handlePointClick = useCallback(
    (point: any) => {
      const d = point as any;
      if (d.kind === "earthquake") {
        const eq = d.raw as Earthquake;
        onEventClick({
          id: eq.id,
          kind: "earthquake",
          title: `M${eq.magnitude.toFixed(1)} Earthquake`,
          subtitle: eq.place,
          lat: eq.lat,
          lng: eq.lng,
          time: eq.time,
          color: magColor(eq.magnitude),
          magnitude: eq.magnitude,
        });
      } else if (d.kind === "volcano") {
        const v = d.raw as Volcano;
        onEventClick({
          id: v.id,
          kind: "volcano",
          title: v.name,
          subtitle: `${v.country} · ${v.elevation.toLocaleString()}m · ${v.status}`,
          lat: v.lat,
          lng: v.lng,
          time: Date.now(),
          color: volColor(v.status),
        });
      } else if (d.kind === "iss") {
        const i = d.raw as ISSPosition;
        onEventClick({
          id: "iss",
          kind: "iss",
          title: "International Space Station",
          subtitle: `Alt: ${i.altitude} km · Speed: ${i.velocity.toLocaleString()} km/h`,
          lat: i.lat,
          lng: i.lng,
          time: i.timestamp,
          color: "#5dcaa5",
        });
      }
    },
    [onEventClick],
  );

  return (
    <GlobeGL
      ref={globeRef}
      width={window.innerWidth - 300}
      height={window.innerHeight}
      globeImageUrl={DAY_TEXTURE}
      bumpImageUrl={BUMP_TEXTURE}
      backgroundImageUrl="//cdn.jsdelivr.net/npm/three-globe/example/img/night-sky.png"
      showAtmosphere={true}
      atmosphereColor="#3a88dd"
      atmosphereAltitude={0.14}
      pointsData={pointsData}
      pointLat="lat"
      pointLng="lng"
      pointColor="color"
      pointRadius="radius"
      pointAltitude="altitude"
      pointResolution={10}
      onPointClick={handlePointClick}
      pointLabel={(d: any) => `
        <div style="
          background:rgba(4,10,24,.95);
          border:0.5px solid rgba(100,180,255,.3);
          border-radius:7px;padding:7px 11px;
          font-size:11px;color:#9fc8f5;
          font-family:monospace;line-height:1.6;
          max-width:180px;
        ">
          <strong style="color:${d.color}">${d.kind}</strong><br/>
          ${d.raw?.place || d.raw?.name || "ISS"}
          ${d.raw?.magnitude ? `<br/>M${d.raw.magnitude.toFixed(1)}` : ""}
        </div>
      `}
      ringsData={ringsData}
      ringLat="lat"
      ringLng="lng"
      ringColor={(d: any) => (t: number) =>
        `${d.color}${Math.round((1 - t) * 200)
          .toString(16)
          .padStart(2, "0")}`
      }
      ringMaxRadius="maxR"
      ringPropagationSpeed="propagationSpeed"
      ringRepeatPeriod="repeatPeriod"
      pathsData={pathsData}
      pathPoints="coords"
      pathPointLat={(p: any) => p[0]}
      pathPointLng={(p: any) => p[1]}
      pathColor="color"
      pathDashLength={0.4}
      pathDashGap={0.2}
      pathDashAnimateTime={3000}
      pathStroke={0.4}
    />
  );
}
