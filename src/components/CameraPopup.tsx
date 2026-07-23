import type { Camera } from "../types/camera";
import HlsVideo from "./HlsVideo";

interface Props {
  camera: Camera;
}

function CameraPopup({ camera }: Props) {
  return (
    <div className="marker-popup" style={{ width: 260 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 8,
        }}
      >
        <h3 style={{ margin: 0 }}>{camera.name}</h3>
        <span
          className={
            "badge " +
            (camera.status === "online" ? "badge-online" : "badge-offline")
          }
        >
          <span className="badge-dot" />
          {camera.status === "online" ? "Online" : "Offline"}
        </span>
      </div>

      <p>{camera.address}</p>

      <p>
        Signal: <b style={{ color: "var(--text)" }}>{camera.signal}%</b>
      </p>

      <p>Last seen: {camera.lastSeen}</p>

      {camera.alert && (
        <div style={{ marginTop: 6 }}>
          <span
            className={
              "badge " +
              (camera.alert.severity === "critical"
                ? "badge-critical"
                : "badge-warning")
            }
          >
            🚨 {camera.alert.type} · {camera.alert.severity}
          </span>
        </div>
      )}

      <HlsVideo src={camera.streamUrl} controls muted style={{ width: "100%" }} />
    </div>
  );
}

export default CameraPopup;
