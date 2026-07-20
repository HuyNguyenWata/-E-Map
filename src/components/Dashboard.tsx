import type { Camera } from "../types/camera";
import type { CameraAlert } from "../types/alert";

interface Props {
  cameras: Camera[];

  alerts: CameraAlert[];
}

function Dashboard({ cameras, alerts }: Props) {
  const totalCamera = cameras.length;

  const onlineCamera = cameras.filter(
    (camera) => camera.status === "online",
  ).length;

  const offlineCamera = cameras.filter(
    (camera) => camera.status === "offline",
  ).length;

  const criticalAlerts = alerts.filter(
    (alert) => alert.severity === "critical",
  ).length;

  return (
    <div
      className="panel-block"
      style={{
        width: "100%",
        padding: 14,
        boxSizing: "border-box",
        flexShrink: 0,
      }}
    >
      <h3 className="panel-title" style={{ marginBottom: 12 }}>
        📷 Camera Dashboard
      </h3>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 8,
        }}
      >
        <div className="dashboard-stat">
          <span className="dashboard-stat-label">Tổng camera</span>
          <b className="dashboard-stat-value">{totalCamera}</b>
        </div>

        <div className="dashboard-stat">
          <span className="dashboard-stat-label">🟢 Online</span>
          <b className="dashboard-stat-value" style={{ color: "var(--success)" }}>
            {onlineCamera}
          </b>
        </div>

        <div className="dashboard-stat">
          <span className="dashboard-stat-label">⚪ Offline</span>
          <b className="dashboard-stat-value" style={{ color: "var(--neutral)" }}>
            {offlineCamera}
          </b>
        </div>

        <div className="dashboard-stat">
          <span className="dashboard-stat-label">🚨 Alert</span>
          <b className="dashboard-stat-value" style={{ color: "var(--warning)" }}>
            {alerts.length}
          </b>
        </div>

        <div className="dashboard-stat" style={{ gridColumn: "1 / -1" }}>
          <span className="dashboard-stat-label">🔥 Critical</span>
          <b className="dashboard-stat-value" style={{ color: "var(--danger)" }}>
            {criticalAlerts}
          </b>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
