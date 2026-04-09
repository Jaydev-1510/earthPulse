export interface Earthquake {
  id: string;
  lat: number;
  lng: number;
  depth: number;
  magnitude: number;
  place: string;
  time: number;
  url: string;
  tsunami: boolean;
  felt: number | null;
}

export interface Volcano {
  id: string;
  name: string;
  lat: number;
  lng: number;
  country: string;
  region: string;
  elevation: number;
  status: "erupting" | "intermittent" | "unrest" | "dormant";
  lastKnownActivity: number;
}

export interface ISSPosition {
  lat: number;
  lng: number;
  altitude: number;
  velocity: number;
  timestamp: number;
}

export interface TsunamiWarning {
  id: string;
  lat: number;
  lng: number;
  region: string;
  severity: "watch" | "advisory" | "warning";
  issuedAt: number;
}

export interface SolarFlare {
  id: string;
  classType: string;
  peakTime: string;
  lat: number;
  lng: number;
}

export interface AuroraState {
  kpIndex: number;
  level: "none" | "low" | "moderate" | "high" | "extreme";
  updatedAt: number;
}

export type EventKind =
  | "earthquake"
  | "volcano"
  | "iss"
  | "tsunami"
  | "solar"
  | "aurora";

export interface FeedEvent {
  id: string;
  kind: EventKind;
  title: string;
  subtitle: string;
  lat: number;
  lng: number;
  time: number;
  color: string;
  magnitude?: number;
}

export interface LayerVisibility {
  earthquakes: boolean;
  volcanoes: boolean;
  iss: boolean;
  aurora: boolean;
  tsunami: boolean;
  solar: boolean;
  heatmap: boolean;
}

export interface AppState {
  layers: LayerVisibility;
  selectedEvent: FeedEvent | null;
  searchQuery: string;
  isLoading: boolean;
  earthquakes: Earthquake[];
  volcanoes: Volcano[];
  iss: ISSPosition | null;
  issTrail: ISSPosition[];
  aurora: AuroraState | null;
  tsunamis: TsunamiWarning[];
  solarFlares: SolarFlare[];
}
