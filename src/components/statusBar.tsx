import type { AuroraState, ISSPosition } from "../types";

interface StatusBarProps {
  eqCount: number;
  maxMag: string;
  volCount: number;
  iss: ISSPosition | null;
  aurora: AuroraState | null;
  eqError: boolean;
}

export function StatusBar({
  eqCount,
  maxMag,
  volCount,
  iss,
  aurora,
  eqError,
}: StatusBarProps) {
  return (
    <div className="status-bar">
      <div className="stat">
        <span className="stat-label">Earthquakes</span>
        <span className="stat-value">{eqCount}</span>
      </div>
      <div className="stat-divider" />
      <div className="stat">
        <span className="stat-label">Max magnitude</span>
        <span className="stat-value">{maxMag}</span>
      </div>
      <div className="stat-divider" />
      <div className="stat">
        <span className="stat-label">Active volcanoes</span>
        <span className="stat-value">{volCount}</span>
      </div>
      <div className="stat-divider" />
      {iss && (
        <>
          <div className="stat">
            <span className="stat-label">ISS altitude</span>
            <span className="stat-value">{iss.altitude} km</span>
          </div>
          <div className="stat-divider" />
          <div className="stat">
            <span className="stat-label">ISS speed</span>
            <span className="stat-value">
              {iss.velocity.toLocaleString()} km/h
            </span>
          </div>
          <div className="stat-divider" />
        </>
      )}
      {aurora && (
        <div className="stat">
          <span className="stat-label">Aurora Kp</span>
          <span className="stat-value">{aurora.kpIndex.toFixed(1)}</span>
        </div>
      )}
      <div className="stat-source">
        <span className={`source-dot ${eqError ? "error" : "live"}`} />
        {eqError ? "Offline · showing cached data" : "USGS · Live"}
      </div>
    </div>
  );
}
