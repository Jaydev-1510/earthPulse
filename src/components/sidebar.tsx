import { useMemo, useState } from "react";
import type { Earthquake, Volcano, ISSPosition, FeedEvent } from "../types";
import { magColor, magLabel } from "../data/usgs";
import { volColor } from "../data/volcanoes";

function timeAgo(ms: number): string {
  const s = Math.floor((Date.now() - ms) / 1000);
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  return `${Math.floor(s / 3600)}h ago`;
}

interface SidebarProps {
  earthquakes: Earthquake[];
  volcanoes: Volcano[];
  iss: ISSPosition | null;
  onSelect: (event: FeedEvent) => void;
  selectedId: string | null;
}

export function Sidebar({
  earthquakes,
  volcanoes,
  iss,
  onSelect,
  selectedId,
}: SidebarProps) {
  const [query, setQuery] = useState("");

  const feedEvents = useMemo((): FeedEvent[] => {
    const events: FeedEvent[] = [];

    earthquakes.forEach((eq) =>
      events.push({
        id: eq.id,
        kind: "earthquake",
        title: `M${eq.magnitude.toFixed(1)} — ${magLabel(eq.magnitude)}`,
        subtitle: eq.place,
        lat: eq.lat,
        lng: eq.lng,
        time: eq.time,
        color: magColor(eq.magnitude),
        magnitude: eq.magnitude,
      }),
    );

    volcanoes.forEach((v) =>
      events.push({
        id: v.id,
        kind: "volcano",
        title: v.name,
        subtitle: `${v.country} · ${v.status}`,
        lat: v.lat,
        lng: v.lng,
        time: v.lastKnownActivity,
        color: volColor(v.status),
      }),
    );

    if (iss)
      events.push({
        id: "iss",
        kind: "iss",
        title: "ISS",
        subtitle: `${iss.lat.toFixed(1)}°, ${iss.lng.toFixed(1)}° · ${iss.altitude} km`,
        lat: iss.lat,
        lng: iss.lng,
        time: iss.timestamp,
        color: "#5dcaa5",
      });

    return events
      .filter(
        (e) =>
          !query ||
          e.title.toLowerCase().includes(query.toLowerCase()) ||
          e.subtitle.toLowerCase().includes(query.toLowerCase()),
      )
      .sort((a, b) => b.time - a.time);
  }, [earthquakes, volcanoes, iss, query]);

  return (
    <aside className="sidebar">
      <div className="sidebar-head">
        <div className="sidebar-title">Live Feed</div>
        <input
          className="search-input"
          placeholder="Search events..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="feed-count">{feedEvents.length} events</div>
      </div>
      <div className="feed-list">
        {feedEvents.map((ev) => (
          <button
            key={ev.id}
            className={`feed-item ${selectedId === ev.id ? "selected" : ""}`}
            onClick={() => onSelect(ev)}
          >
            <div className="feed-item-top">
              <span className="feed-dot" style={{ background: ev.color }} />
              <span className="feed-kind">{ev.kind}</span>
              {ev.magnitude != null && (
                <span
                  className="feed-badge"
                  style={{ color: ev.color, borderColor: ev.color + "44" }}
                >
                  M{ev.magnitude.toFixed(1)}
                </span>
              )}
              {ev.kind !== "volcano" ? (
                <span className="feed-time">{timeAgo(ev.time)}</span>
              ) : (
                <span className="feed-time">{"on " + ev.time}</span>
              )}
            </div>
            <div className="feed-title">{ev.title}</div>
            <div className="feed-subtitle">{ev.subtitle}</div>
          </button>
        ))}
        {feedEvents.length === 0 && (
          <div className="feed-empty">No events match "{query}"</div>
        )}
      </div>
    </aside>
  );
}
