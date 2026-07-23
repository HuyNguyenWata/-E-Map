import type { ChangeEvent } from "react";

interface Props {
  value: number;
  onChange: (size: number) => void;
  min?: number;
  max?: number;
}

const PRESETS = [1, 2, 3, 4, 6, 8, 10, 12, 16, 20, 24];

function CameraWallGridControl({ value, onChange, min = 1, max = 32 }: Props) {
  const clamp = (n: number) => Math.min(Math.max(Math.round(n), min), max);

  const handleCustomChange = (e: ChangeEvent<HTMLInputElement>) => {
    const n = Number(e.target.value);

    if (!Number.isFinite(n) || e.target.value === "") return;

    onChange(clamp(n));
  };

  const step = (delta: number) => onChange(clamp(value + delta));

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
      <span style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 600 }}>
        Kích thước lưới:
      </span>

      {PRESETS.map((n) => (
        <button
          key={n}
          type="button"
          className={`btn btn-sm${value === n ? " btn-active" : ""}`}
          onClick={() => onChange(n)}
          title={`Hiển thị ${n} x ${n} camera`}
        >
          {n}×{n}
        </button>
      ))}

      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        <button
          type="button"
          className="btn btn-sm btn-icon"
          onClick={() => step(-1)}
          disabled={value <= min}
          title="Giảm số lưới"
        >
          −
        </button>

        <input
          type="number"
          min={min}
          max={max}
          value={value}
          onChange={handleCustomChange}
          title="Tùy chỉnh số lưới (N x N)"
          style={{
            width: 50,
            padding: "6px 4px",
            textAlign: "center",
            borderRadius: "var(--radius-sm)",
            border: "1px solid var(--border)",
            background: "var(--panel-bg)",
            color: "var(--text)",
            fontSize: 12,
          }}
        />

        <button
          type="button"
          className="btn btn-sm btn-icon"
          onClick={() => step(1)}
          disabled={value >= max}
          title="Tăng số lưới"
        >
          +
        </button>
      </div>
    </div>
  );
}

export default CameraWallGridControl;
