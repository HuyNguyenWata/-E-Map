import type { VehicleBox } from "../types/behavior";

const VEHICLE_COLORS: Record<string, string> = {
  car: "#38bdf8",
  motorcycle: "#f59e0b",
  bus: "#a78bfa",
  truck: "#f87171",
};

const VEHICLE_LABELS: Record<string, string> = {
  car: "Ô tô",
  motorcycle: "Xe máy",
  bus: "Xe buýt",
  truck: "Xe tải",
};

interface Props {
  vehicleBoxes: VehicleBox[];
}

// Dùng chung cho cả CameraDetailPanel (xem 1 camera) và CameraVideoCard
// (Camera Wall, nhiều camera cùng lúc) — tách riêng để không lặp lại logic vẽ.
function VehicleBoxOverlay({ vehicleBoxes }: Props) {
  if (vehicleBoxes.length === 0) return null;

  return (
    <svg
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      {vehicleBoxes.map((v, i) => {
        const color = VEHICLE_COLORS[v.vehicleType] ?? "#38bdf8";
        const x = v.x1 * 100;
        const y = v.y1 * 100;
        const w = (v.x2 - v.x1) * 100;
        const h = (v.y2 - v.y1) * 100;
        return (
          <g key={i}>
            <rect
              x={x}
              y={y}
              width={w}
              height={h}
              fill="none"
              stroke={color}
              strokeWidth={0.5}
              vectorEffect="non-scaling-stroke"
            />
            <text
              x={x}
              y={Math.max(y - 1, 3)}
              fill={color}
              fontSize={3}
              style={{ paintOrder: "stroke", stroke: "#000", strokeWidth: 0.6 }}
            >
              {VEHICLE_LABELS[v.vehicleType] ?? v.vehicleType} {Math.round(v.confidence * 100)}%
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export default VehicleBoxOverlay;
