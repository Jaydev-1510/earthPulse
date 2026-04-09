import { useRef, useMemo, useCallback, useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import R3fGlobe, { type GlobeMethods } from "r3f-globe";
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
import * as THREE from "three";

const DAY_TEXTURE = "./texture.webp";

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

type PointBase = {
  lat: number;
  lng: number;
  size: number;
  color: string;
};

type EarthquakePoint = PointBase & {
  kind: "earthquake";
  data: Earthquake;
};

type VolcanoPoint = PointBase & {
  kind: "volcano";
  data: Volcano;
};

type ISSPoint = PointBase & {
  kind: "iss";
  data: ISSPosition;
};

type MapPoint = EarthquakePoint | VolcanoPoint | ISSPoint;

type Ring = {
  lat: number;
  lng: number;
  maxR: number;
  propagationSpeed: number;
  repeatPeriod: number;
  color: ((t: number) => string) | (() => (t: number) => string);
};

function CameraController({
  target,
}: {
  target: { lat: number; lng: number } | null;
}) {
  const { camera } = useThree();

  useEffect(() => {
    if (!target) return;
    const phi = ((90 - target.lat) * Math.PI) / 180;
    const theta = ((target.lng + 180) * Math.PI) / 180;
    const r = 200;
    const x = -r * Math.sin(phi) * Math.cos(theta);
    const y = r * Math.cos(phi);
    const z = r * Math.sin(phi) * Math.sin(theta);
    camera.position.set(x, y, z);
    camera.lookAt(0, 0, 0);
  }, [target, camera]);

  return null;
}

interface GlobeSceneProps {
  earthquakes: Earthquake[];
  volcanoes: Volcano[];
  iss: ISSPosition | null;
  issTrail: ISSPosition[];
  aurora: AuroraState | null;
  layers: LayerVisibility;
  flyTarget: { lat: number; lng: number } | null;
  onEventClick: (event: FeedEvent) => void;
}

function GlobeScene({
  earthquakes,
  volcanoes,
  iss,
  issTrail,
  aurora,
  layers,
  flyTarget,
  onEventClick,
}: GlobeSceneProps) {
  const globeRef = useRef<GlobeMethods | undefined>(undefined);
  const { size } = useThree();
  const pointsData = useMemo(() => {
    const pts: MapPoint[] = [];

    if (layers.earthquakes) {
      earthquakes.forEach((eq) => {
        pts.push({
          lat: eq.lat,
          lng: eq.lng,
          size: magRadius(eq.magnitude),
          color: magColor(eq.magnitude),
          kind: "earthquake",
          data: eq,
        });
      });
    }

    if (layers.volcanoes) {
      volcanoes.forEach((v) => {
        pts.push({
          lat: v.lat,
          lng: v.lng,
          size: v.status === "erupting" ? 0.7 : 0.45,
          color: volColor(v.status),
          kind: "volcano",
          data: v,
        });
      });
    }

    if (layers.iss && iss) {
      pts.push({
        lat: iss.lat,
        lng: iss.lng,
        size: 0.6,
        color: "#ffffff",
        kind: "iss",
        data: iss,
      });
    }

    return pts;
  }, [earthquakes, volcanoes, iss, layers]);

  const ringsData = useMemo(() => {
    const rings: Ring[] = [];

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
            color: () => {
              const c = magColor(eq.magnitude);
              return (t: number) =>
                `${c}${Math.round((1 - t) * 255)
                  .toString(16)
                  .padStart(2, "0")}`;
            },
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
          color: (t: number) => {
            const c = kpToColor(aurora.kpIndex);
            const opacity = kpToOpacity(aurora.kpIndex) * (1 - t);
            return `${c}${Math.round(opacity * 255)
              .toString(16)
              .padStart(2, "0")}`;
          },
        }),
      );
    }

    return rings;
  }, [earthquakes, aurora, layers]);

  const pathsData = useMemo(() => {
    if (!layers.iss || issTrail.length < 2) return [];
    return [
      {
        points: issTrail.map((p) => [p.lat, p.lng]),
        color: ["#5dcaa5aa", "#5dcaa500"],
        stroke: 0.3,
      },
    ];
  }, [issTrail, layers.iss]);

  const handleClick = useCallback(
    (layer: string, d: object | undefined) => {
      if (!d) return;

      const point = d as MapPoint;

      if (point.kind === "earthquake") {
        const eq = point.data as Earthquake;
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
      } else if (point.kind === "volcano") {
        const v = point.data as Volcano;
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
      } else if (point.kind === "iss") {
        const i = point.data as ISSPosition;
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
    <>
      <CameraController target={flyTarget} />
      <ambientLight intensity={1.2} />
      <directionalLight position={[5, 3, 5]} intensity={0.8} />
      <R3fGlobe
        ref={globeRef}
        rendererSize={new THREE.Vector2(size.width, size.height)}
        globeImageUrl={DAY_TEXTURE}
        showAtmosphere={true}
        atmosphereColor="#3a88dd"
        atmosphereAltitude={0.14}
        showGraticules={true}
        pointsData={pointsData}
        pointLat="lat"
        pointLng="lng"
        pointColor="color"
        pointRadius="size"
        pointAltitude={0.005}
        pointResolution={10}
        pointsMerge={true}
        pointsTransitionDuration={0}
        ringsData={ringsData}
        ringLat="lat"
        ringLng="lng"
        ringColor="color"
        ringMaxRadius="maxR"
        ringPropagationSpeed="propagationSpeed"
        ringRepeatPeriod="repeatPeriod"
        pathsData={pathsData}
        pathPoints="points"
        pathPointLat={(p: number[]) => p[0]}
        pathPointLng={(p: number[]) => p[1]}
        pathColor="color"
        pathStroke="stroke"
        pathDashLength={0.4}
        pathDashGap={0.2}
        pathDashAnimateTime={2000}
        onClick={handleClick}
      />
    </>
  );
}

type GlobeProps = GlobeSceneProps;

export function Globe(props: GlobeProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 280], fov: 50, near: 0.1, far: 1000 }}
      style={{ background: "#040810" }}
      gl={{ antialias: true }}
    >
      <GlobeScene {...props} />
      <OrbitControls
        enablePan={false}
        minDistance={120}
        maxDistance={500}
        autoRotate={true}
        autoRotateSpeed={0.4}
        enableDamping={true}
        dampingFactor={0.08}
      />
    </Canvas>
  );
}
