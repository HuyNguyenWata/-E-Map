import type { CameraAlert } from "../types/alert";

interface Props {
  alerts: CameraAlert[];

  onSelect: (cameraId: number) => void;
}

function AlertPanel({ alerts, onSelect }: Props) {
  return (
    <div
      style={{
        position: "absolute",
        right: 20,
        top: 20,
        width: 320,
        maxHeight: 500,
        overflow: "auto",
        background: "#fff",
        zIndex: 1000,
        padding: 15,
        borderRadius: 10,
        boxShadow: "0 4px 15px rgba(0,0,0,.2)",
      }}
    >
      <h3>🚨 Cảnh báo</h3>

      {alerts.map((alert) => (
        <div
          key={alert.id}
          onClick={() => onSelect(alert.cameraId)}
          style={{
            cursor: "pointer",

            padding: 10,

            marginTop: 10,

            border: "1px solid #ddd",

            borderRadius: 6,
          }}
        >
          <b>{alert.cameraName}</b>
          <br />
          Loại:
          <span
            style={{
              color: "red",
              fontWeight: "bold",
            }}
          >
            {" "}
            {alert.type}
          </span>
          <br />
          {alert.time}
        </div>
      ))}
    </div>
  );
}

export default AlertPanel;
