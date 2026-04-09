import type { ISSPosition } from "../types";

export async function fetchISS(): Promise<ISSPosition> {
  const res = await fetch("https://api.wheretheiss.at/v1/satellites/25544");
  const d = await res.json();
  return {
    lat: d.latitude,
    lng: d.longitude,
    altitude: Math.round(d.altitude),
    velocity: Math.round(d.velocity),
    timestamp: Date.now(),
  };
}

export function generateISSOrbitArc(
  lat: number,
  lng: number,
): Array<[number, number]> {
  const points: Array<[number, number]> = [];
  const orbitalPeriod = 92;
  const earthRotationPerMin = 0.25;
  const inclinationOffset = 51.6;

  for (let i = 0; i <= orbitalPeriod; i += 2) {
    const fraction = i / orbitalPeriod;
    const dLng =
      (lng + i * (360 / orbitalPeriod) - i * earthRotationPerMin) % 360;
    const dLat = Math.sin(fraction * Math.PI * 2) * inclinationOffset * 0.6;
    points.push([lat + dLat * 0.3, dLng > 180 ? dLng - 360 : dLng]);
  }
  return points;
}
