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
      style={{
        width: "100%",

        background: "#fff",

        borderRadius: 12,

        padding: 16,

        boxSizing: "border-box",

        boxShadow: "0 2px 10px rgba(0,0,0,.1)",
      }}
    >
      <h3>📷 Camera Dashboard</h3>

      <div className="dashboard-item">
        Tổng camera:
        <b>{totalCamera}</b>
      </div>

      <div className="dashboard-item">
        🟢 Online:
        <b>{onlineCamera}</b>
      </div>

      <div className="dashboard-item">
        ⚪ Offline:
        <b>{offlineCamera}</b>
      </div>

      <div className="dashboard-item">
        🚨 Alert:
        <b>{alerts.length}</b>
      </div>

      <div className="dashboard-item">
        🔥 Critical:
        <b>{criticalAlerts}</b>
      </div>
    </div>
  );
}

export default Dashboard;
