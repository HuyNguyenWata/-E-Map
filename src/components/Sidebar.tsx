import type { Camera } from "../types/camera";
import { useAuth } from "../auth/AuthContext";

interface Props {
  cameras: Camera[];
  onSelect: (camera: Camera) => void;
  onAddCamera: () => void;
}

function Sidebar({ cameras, onSelect, onAddCamera }: Props) {
  const { user } = useAuth();

  return (
    <div
      style={{
        width: "100%",

        display: "flex",

        flexDirection: "column",

        gap: 8,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 2,
        }}
      >
        <h3 className="panel-title" style={{ margin: 0 }}>
          Danh sách Camera ({cameras.length})
        </h3>

        {user?.role === "admin" && (
          <button className="btn btn-sm btn-primary" onClick={onAddCamera}>
            + Thêm
          </button>
        )}
      </div>

      {cameras.length === 0 && (
        <div className="empty-state">Không tìm thấy camera phù hợp</div>
      )}

      {cameras.map((camera) => (
        <div
          key={camera.id}
          onClick={() => onSelect(camera)}
          className="card card-clickable"
          style={{
            padding: 10,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: 8,
            }}
          >
            <b style={{ fontSize: 13 }}>{camera.name}</b>

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

          <div
            style={{
              fontSize: 12,
              color: "var(--text-muted)",
              marginTop: 4,
            }}
          >
            {camera.address}
          </div>

          <div
            style={{
              display: "flex",
              gap: 10,
              fontSize: 11,
              color: "var(--text-faint)",
              marginTop: 2,
            }}
          >
            <span>Signal {camera.signal}%</span>
            <span>{camera.lastSeen}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
export default Sidebar;
