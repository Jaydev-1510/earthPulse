import type { Earthquake } from "../types";

const USGS_URL =
  "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_day.geojson";

export async function fetchEarthquakes(): Promise<Earthquake[]> {
  const res = await fetch(USGS_URL);
  const data = await res.json();
  return data.features.map(
    (f: any): Earthquake => ({
      id: f.id,
      lat: f.geometry.coordinates[1],
      lng: f.geometry.coordinates[0],
      depth: Math.round(f.geometry.coordinates[2]),
      magnitude: f.properties.mag ?? 0,
      place: f.properties.place ?? "Unknown location",
      time: f.properties.time,
      url: f.properties.url,
      tsunami: f.properties.tsunami === 1,
      felt: f.properties.felt,
    }),
  );
}

export function magColor(mag: number): string {
  if (mag < 2.5) return "#9fe1cb";
  if (mag < 4.0) return "#1d9e75";
  if (mag < 5.0) return "#ef9f27";
  if (mag < 6.0) return "#e27c27";
  if (mag < 7.0) return "#e24b4a";
  return "#a32d2d";
}

export function magRadius(mag: number): number {
  return Math.max(0.2, Math.min(1.8, mag * 0.2));
}

export function magLabel(mag: number): string {
  if (mag < 2.5) return "Minor";
  if (mag < 4.0) return "Light";
  if (mag < 5.0) return "Moderate";
  if (mag < 6.0) return "Strong";
  if (mag < 7.0) return "Major";
  return "Great";
}
