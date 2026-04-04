export enum EventType {
  Earthquake = "earthquake",
  Volcano = "volcano",
  Tsunami = "tsunami",
  Aurora = "aurora",
  SolarFlare = "solar_flare",
  Meteor = "meteor",
  ISS = "iss",
}

export enum MagnitudeClass {
  Low = "low",
  Minor = "minor",
  Moderate = "moderate",
  Strong = "strong",
  Major = "major",
}

export enum LayerId {
  Earthquakes = "eq",
  Volcanoes = "vol",
  ISS = "iss",
  Aurora = "aurora",
  Tsunami = "tsunami",
  Solar = "solar",
  Meteor = "meteor",
  NearMe = "nearme",
}

export interface LatLon {
  lat: number;
  lon: number;
}

export interface LatLonDepth extends LatLon {
  depth: number;
}

export interface USGSFeature {
  type: "Feature";
  geometry: {
    type: "Point";
    coordinates: [number, number, number];
  };
  properties: {
    mag: number;
    place: string;
    time: number;
    updated: number;
    url: string;
    detail: string;
    felt: number | null;
    alert: string | null;
    status: string;
    tsunami: number;
    sig: number;
    net: string;
    code: string;
    ids: string;
    type: string;
    title: string;
  };
  id: string;
}

export interface USGSResponse {
  type: string;
  metadata: {
    generated: number;
    url: string;
    title: string;
    status: number;
    api: string;
    count: number;
  };
  features: USGSFeature[];
}

export interface Earthquake {
  id: string;
  type: EventType.Earthquake;
  lat: number;
  lon: number;
  depth: number;
  magnitude: number;
  magClass: MagnitudeClass;
  place: string;
  time: Date;
  url: string;
  tsunami: boolean;
  felt: number | null;
  alert: string | null;
  title: string;
}

export interface Volcano {
  id: string;
  type: EventType.Volcano;
  name: string;
  lat: number;
  lon: number;
  country: string;
  region: string;
  elevation: number;
  status: "erupting" | "restless" | "normal";
  lastActivity?: string;
}

export interface ISSPosition {
  lat: number;
  lon: number;
  altitude: number;
  velocity: number;
  timestamp: Date;
  visibility: "daylight" | "eclipsed";
}

export interface ISSPass {
  risetime: Date;
  duration: number;
  maxEl: number;
}

export interface ISSState {
  current: ISSPosition;
  trail: ISSPosition[];
  orbitArc: LatLon[];
  nextPass?: ISSPass;
}

export interface TsunamiWarning {
  id: string;
  type: EventType.Tsunami;
  lat: number;
  lon: number;
  severity: "watch" | "advisory" | "warning";
  region: string;
  issuedAt: Date;
  source: string;
}

export interface AuroraState {
  kpIndex: number;
  kpForecast: KpForecast[];
  level: "none" | "low" | "moderate" | "high" | "extreme";
  updatedAt: Date;
}

export interface KpForecast {
  time: Date;
  kp: number;
}

export interface SolarFlare {
  id: string;
  type: EventType.SolarFlare;
  classType: string;
  beginTime: Date;
  peakTime: Date;
  endTime?: Date;
  region?: string;
  link: string;
}

export interface MeteorShower {
  id: string;
  type: EventType.Meteor;
  name: string;
  peak: string;
  active: boolean;
  radiantLat: number;
  radiantLon: number;
  zhr: number;
  parent: string;
}

export type EarthEvent = Earthquake | Volcano | TsunamiWarning | SolarFlare;

export interface LayerState {
  [LayerId.Earthquakes]: boolean;
  [LayerId.Volcanoes]: boolean;
  [LayerId.ISS]: boolean;
  [LayerId.Aurora]: boolean;
  [LayerId.Tsunami]: boolean;
  [LayerId.Solar]: boolean;
  [LayerId.Meteor]: boolean;
  [LayerId.NearMe]: boolean;
}

export interface FilterState {
  magMin: number;
  magMax: number;
  types: EventType[];
  dateFrom: Date | null;
  dateTo: Date | null;
  radius: number | null;
  userLat: number | null;
  userLon: number | null;
}

export interface ScrubberState {
  active: boolean;
  dateFrom: Date;
  dateTo: Date;
  cursor: Date;
  playing: boolean;
  speed: 1 | 2 | 5 | 10;
}

export interface DailyCount {
  date: string;
  count: number;
  maxMag: number;
}

export interface FaultLineStats {
  name: string;
  region: string;
  count: number;
  avgMag: number;
}

export interface StatsData {
  totalEarthquakes: number;
  avgMagnitude: number;
  maxMagnitude: number;
  totalVolcanoes: number;
  activeVolcanoes: number;
  issOrbits: number;
  issDistance: number;
  daily: DailyCount[];
  faultLines: FaultLineStats[];
  auroraAvgKp: number;
}

export interface EpDataPayload {
  earthquakes: Earthquake[];
  volcanoes: Volcano[];
  iss: ISSState;
  aurora: AuroraState;
  tsunamis: TsunamiWarning[];
  solarFlares: SolarFlare[];
}

export interface EpSelectPayload {
  event: EarthEvent | null;
}

export interface EpFlyToPayload {
  lat: number;
  lon: number;
  zoom?: number;
}

export interface EpLayerPayload {
  layer: LayerId;
  visible: boolean;
}

declare global {
  interface WindowEventMap {
    "ep:data": CustomEvent<EpDataPayload>;
    "ep:select": CustomEvent<EpSelectPayload>;
    "ep:flyto": CustomEvent<EpFlyToPayload>;
    "ep:layer": CustomEvent<EpLayerPayload>;
  }
}

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface MarkerMeta {
  id: string;
  type: EventType;
  lat: number;
  lon: number;
  payload: EarthEvent;
}
