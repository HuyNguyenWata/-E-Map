import type { CameraAlert } from "../types/alert";

interface Props {
  events: CameraAlert[];
}

function EventTimeline({ events }: Props) {
  return (
    <div>
      <h3>📅 Event Timeline</h3>

      {events.length === 0 ? (
        <p>Không có sự kiện</p>
      ) : (
        events.map((event) => (
          <div
            key={event.id}
            style={{
              display: "flex",

              gap: 10,

              padding: "10px 0",

              borderLeft: "3px solid #ddd",

              paddingLeft: 15,
            }}
          >
            <div>
              {event.type === "fire"
                ? "🔥"
                : event.type === "person"
                  ? "👤"
                  : event.type === "vehicle"
                    ? "🚗"
                    : "⚠️"}
            </div>

            <div>
              <b>{event.type}</b>

              <br />

              <span>{event.time}</span>

              <br />

              <small>{event.severity}</small>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default EventTimeline;
