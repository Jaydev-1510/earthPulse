import type { FeedEvent } from "../types";

function timeStr(ms: number): string {
  return new Date(ms).toUTCString().replace(" GMT", " UTC").slice(0, 25);
}

interface EventDetailProps {
  event: FeedEvent | null;
  onClose: () => void;
}

export function EventDetail({ event, onClose }: EventDetailProps) {
  if (!event) return null;

  return (
    <div className="event-detail">
      <div className="detail-header">
        <div className="detail-kind-row">
          <span className="detail-dot" style={{ background: event.color }} />
          <span className="detail-kind">{event.kind}</span>
          {event.magnitude != null && (
            <span className="detail-mag" style={{ color: event.color }}>
              M{event.magnitude.toFixed(1)}
            </span>
          )}
        </div>
        <button className="detail-close" onClick={onClose}>
          ✕
        </button>
      </div>
      <div className="detail-title">{event.title}</div>
      <div className="detail-subtitle">{event.subtitle}</div>
      <div className="detail-meta">
        <div className="detail-meta-row">
          <span className="meta-label">Coordinates</span>
          <span className="meta-value">
            {event.lat.toFixed(2)}°, {event.lng.toFixed(2)}°
          </span>
        </div>
        <div className="detail-meta-row">
          <span className="meta-label">Time</span>
          {event.kind != "volcano" ? (
            <span className="meta-value">{timeStr(event.time)}</span>
          ) : (
            <span className="meta-value">{"In " + event.time}</span>
          )}
        </div>
      </div>
    </div>
  );
}
