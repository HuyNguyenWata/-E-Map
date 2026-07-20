import type { Camera } from "../types/camera";

interface Props {
  cameras: Camera[];
  onSelect: (camera: Camera) => void;
}

function Sidebar({ cameras, onSelect }: Props) {
  return (
    <div
      style={{
        width: "100%",

        display: "flex",

        flexDirection: "column",

        gap: 8,
      }}
    >
      <h3 className="panel-title" style={{ marginBottom: 2 }}>
        Danh sách Camera ({cameras.length})
      </h3>

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
        </div>
      ))}
    </div>
  );
}
export default Sidebar;
