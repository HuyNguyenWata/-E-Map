import { useTranslation } from "react-i18next";
import type { CameraAlert } from "../types/alert";

interface Props {
  events: CameraAlert[];
}

function EventTimeline({ events }: Props) {
  const { t } = useTranslation();

  return (
    <div>
      <h3 style={{ marginBottom: 8 }}>📅 Event Timeline</h3>

      {events.length === 0 ? (
        <div className="empty-state">{t("cameraDetail.noEvents")}</div>
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
                    : event.type === "crowd"
                      ? "👥"
                      : event.type === "weapon"
                        ? "🔫"
                        : event.type === "spoof"
                          ? "🎭"
                          : event.type === "litter"
                            ? "🗑️"
                            : event.type === "lineCrossing"
                              ? "🚧"
                              : event.type === "zoneIntrusion"
                                ? "⬛"
                                : event.type === "loitering"
                                  ? "🕓"
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
