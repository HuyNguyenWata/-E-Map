import type { CameraAlert } from "../types/alert";

interface Props {
  events: CameraAlert[];
}

function EventTimeline({ events }: Props) {
  return (
    <div>
      <h3 style={{ marginBottom: 8 }}>📅 Event Timeline</h3>

      {events.length === 0 ? (
        <div className="empty-state">Không có sự kiện</div>
      ) : (
        events.map((event) => (
          <div
            key={event.id}
            style={{
              display: "flex",

              gap: 10,

              padding: "10px 0",

              borderLeft: "3px solid var(--border)",

              paddingLeft: 15,
            }}
          >
            <div style={{ fontSize: 16 }}>
              {event.type === "fire"
                ? "🔥"
                : event.type === "person"
                  ? "👤"
                  : event.type === "vehicle"
                    ? "🚗"
                    : "⚠️"}
            </div>

            <div>
              <b style={{ fontSize: 13, textTransform: "capitalize" }}>
                {event.type}
              </b>

              <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
                {event.time}
              </div>

              <span
                className={
                  "badge " +
                  (event.severity === "critical"
                    ? "badge-critical"
                    : event.severity === "warning"
                      ? "badge-warning"
                      : "badge-info")
                }
                style={{ marginTop: 4 }}
              >
                {event.severity}
              </span>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default EventTimeline;
