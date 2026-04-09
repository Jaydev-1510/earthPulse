import type { AuroraState } from "../types";

export async function fetchAurora(): Promise<AuroraState> {
  try {
    const res = await fetch(
      "https://services.swpc.noaa.gov/json/planetary_k_index_1m.json",
    );
    const data = await res.json();
    const latest = data[data.length - 1];
    const kp = parseFloat(latest?.kp_index ?? 2);
    return {
      kpIndex: kp,
      level:
        kp < 2
          ? "none"
          : kp < 4
            ? "low"
            : kp < 6
              ? "moderate"
              : kp < 8
                ? "high"
                : "extreme",
      updatedAt: Date.now(),
    };
  } catch {
    return { kpIndex: 2.5, level: "low", updatedAt: Date.now() };
  }
}

export function kpToOpacity(kp: number): number {
  return Math.min(0.7, Math.max(0.1, kp / 9));
}

export function kpToColor(kp: number): string {
  if (kp < 3) return "#7f77dd";
  if (kp < 5) return "#5dcaa5";
  if (kp < 7) return "#ef9f27";
  return "#e24b4a";
}
