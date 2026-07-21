import type { Camera } from "../types/camera";

interface Props {
  radius: number;
  setRadius: (value: number) => void;
  matchedCameras: Camera[];
  onSelectCamera: (camera: Camera) => void;
  onClear: () => void;
}

function RadiusControl({
  radius,
  setRadius,
  matchedCameras,
  onSelectCamera,
  onClear,
}: Props) {
  return (
    <div className="panel-block" style={{ width: 280, padding: 12 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span className="field-label" style={{ marginBottom: 0 }}>
          📍 Bán kính giám sát
        </span>

        <button
          className="btn btn-icon btn-ghost"
          style={{ width: 26, height: 26 }}
          onClick={onClear}
          title="Bỏ chọn vị trí"
        >
          ✕
        </button>
      </div>

      <select
        className="select-input"
        value={radius}
        onChange={(e) => setRadius(Number(e.target.value))}
        style={{ marginTop: 8 }}
      >
        <option value={100}>100m</option>
        <option value={500}>500m</option>
        <option value={1000}>1km</option>
        <option value={2000}>2km</option>
      </select>

      <div
        style={{
          marginTop: 10,
          fontSize: 12,
          color: "var(--text-muted)",
        }}
      >
        {matchedCameras.length} camera trong bán kính
      </div>

      {matchedCameras.length > 0 && (
        <div
          className="scroll-area"
          style={{
            marginTop: 8,
            maxHeight: 180,
            display: "flex",
            flexDirection: "column",
            gap: 4,
          }}
        >
          {matchedCameras.map((camera) => (
            <div
              key={camera.id}
              className="card card-clickable"
              style={{ padding: 8 }}
              onClick={() => onSelectCamera(camera)}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 8,
                }}
              >
                <b style={{ fontSize: 12 }}>{camera.name}</b>

                <span
                  className={
                    "badge " +
                    (camera.status === "online"
                      ? "badge-online"
                      : "badge-offline")
                  }
                >
                  <span className="badge-dot" />
                  {camera.status === "online" ? "Online" : "Offline"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default RadiusControl;
