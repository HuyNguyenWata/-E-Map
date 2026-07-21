import type { Camera } from "../types/camera";

interface Props {
  value: string;
  onChange: (value: string) => void;
  results: Camera[];
  onPick: (camera: Camera) => void;
}

function SearchBox({ value, onChange, results, onPick }: Props) {
  return (
    <div className="panel-block" style={{ width: 280, padding: 10 }}>
      <input
        type="text"
        className="text-input"
        placeholder="Tìm vị trí theo tên hoặc địa chỉ camera..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />

      {results.length > 0 && (
        <div
          className="scroll-area"
          style={{
            marginTop: 8,
            maxHeight: 220,
            display: "flex",
            flexDirection: "column",
            gap: 4,
          }}
        >
          {results.map((camera) => (
            <div
              key={camera.id}
              className="card card-clickable"
              style={{ padding: 8 }}
              onClick={() => onPick(camera)}
            >
              <div style={{ fontSize: 13, fontWeight: 600 }}>
                {camera.name}
              </div>
              <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
                {camera.address}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchBox;
