import { useState, useEffect, useCallback, useRef } from "react";
import type { Earthquake, ISSPosition, AuroraState } from "../types";
import { fetchEarthquakes } from "../data/usgs";
import { fetchISS } from "../data/iss";
import { fetchAurora } from "../data/noaa";
import { VOLCANOES } from "../data/volcanoes";

const ISS_TRAIL_MAX = 24;
const ISS_REFRESH = 2_000;
const EQ_REFRESH = 60_000;
const KP_REFRESH = 120_000;

export function useEarthPulseData() {
  const [earthquakes, setEarthquakes] = useState<Earthquake[]>([]);
  const [iss, setIss] = useState<ISSPosition | null>(null);
  const [issTrail, setIssTrail] = useState<ISSPosition[]>([]);
  const [aurora, setAurora] = useState<AuroraState | null>(null);
  const [loading, setLoading] = useState(true);
  const [eqError, setEqError] = useState(false);

  const trailRef = useRef<ISSPosition[]>([]);

  const loadEQ = useCallback(async () => {
    try {
      const data = await fetchEarthquakes();
      setEarthquakes(data);
      setEqError(false);
    } catch {
      setEqError(true);
      setEarthquakes(FALLBACK_EQ);
    }
  }, []);

  const loadISS = useCallback(async () => {
    try {
      const pos = await fetchISS();
      setIss(pos);
      trailRef.current = [...trailRef.current.slice(-(ISS_TRAIL_MAX - 1)), pos];
      setIssTrail([...trailRef.current]);
    } catch {
      setIss((prev) =>
        prev
          ? { ...prev, lng: (prev.lng + 0.5) % 360, timestamp: Date.now() }
          : {
              lat: 20,
              lng: 0,
              altitude: 408,
              velocity: 27600,
              timestamp: Date.now(),
            },
      );
    }
  }, []);

  const loadAurora = useCallback(async () => {
    const data = await fetchAurora();
    setAurora(data);
  }, []);

  useEffect(() => {
    Promise.all([loadEQ(), loadISS(), loadAurora()]).finally(() =>
      setLoading(false),
    );

    const eqTimer = setInterval(loadEQ, EQ_REFRESH);
    const issTimer = setInterval(loadISS, ISS_REFRESH);
    const kpTimer = setInterval(loadAurora, KP_REFRESH);

    return () => {
      clearInterval(eqTimer);
      clearInterval(issTimer);
      clearInterval(kpTimer);
    };
  }, [loadEQ, loadISS, loadAurora]);

  return {
    earthquakes,
    volcanoes: VOLCANOES,
    iss,
    issTrail,
    aurora,
    loading,
    eqError,
    eqCount: earthquakes.length,
    maxMag: earthquakes.length
      ? Math.max(...earthquakes.map((e) => e.magnitude)).toFixed(1)
      : "—",
  };
}

const FALLBACK_EQ: Earthquake[] = [
  {
    id: "f1",
    lat: 34.0,
    lng: -118.2,
    depth: 12,
    magnitude: 3.1,
    place: "Los Angeles, CA",
    time: Date.now() - 600000,
    url: "",
    tsunami: false,
    felt: null,
  },
  {
    id: "f2",
    lat: 35.7,
    lng: 139.7,
    depth: 40,
    magnitude: 4.2,
    place: "Near Tokyo, Japan",
    time: Date.now() - 1200000,
    url: "",
    tsunami: false,
    felt: null,
  },
  {
    id: "f3",
    lat: -33.4,
    lng: -70.6,
    depth: 80,
    magnitude: 5.1,
    place: "Santiago, Chile",
    time: Date.now() - 2400000,
    url: "",
    tsunami: false,
    felt: null,
  },
  {
    id: "f4",
    lat: 41.0,
    lng: 28.9,
    depth: 10,
    magnitude: 3.8,
    place: "Istanbul, Turkey",
    time: Date.now() - 3600000,
    url: "",
    tsunami: false,
    felt: null,
  },
  {
    id: "f5",
    lat: 13.5,
    lng: 145.6,
    depth: 35,
    magnitude: 6.2,
    place: "Mariana Islands",
    time: Date.now() - 900000,
    url: "",
    tsunami: true,
    felt: null,
  },
  {
    id: "f6",
    lat: -0.5,
    lng: 166.9,
    depth: 25,
    magnitude: 5.8,
    place: "Solomon Islands",
    time: Date.now() - 1800000,
    url: "",
    tsunami: false,
    felt: null,
  },
  {
    id: "f7",
    lat: 19.4,
    lng: -155.5,
    depth: 5,
    magnitude: 2.5,
    place: "Hawaii, USA",
    time: Date.now() - 300000,
    url: "",
    tsunami: false,
    felt: 22,
  },
  {
    id: "f8",
    lat: -12.0,
    lng: -77.0,
    depth: 60,
    magnitude: 3.9,
    place: "Lima, Peru",
    time: Date.now() - 4200000,
    url: "",
    tsunami: false,
    felt: null,
  },
  {
    id: "f9",
    lat: 38.7,
    lng: 116.4,
    depth: 15,
    magnitude: 3.2,
    place: "Hebei, China",
    time: Date.now() - 5400000,
    url: "",
    tsunami: false,
    felt: null,
  },
  {
    id: "f10",
    lat: -6.2,
    lng: 106.8,
    depth: 22,
    magnitude: 4.5,
    place: "Jakarta, Indonesia",
    time: Date.now() - 7200000,
    url: "",
    tsunami: false,
    felt: null,
  },
];
