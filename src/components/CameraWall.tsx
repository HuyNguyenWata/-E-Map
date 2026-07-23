import CameraVideoCard from "./CameraVideoCard";
import type { Camera } from "../types/camera";

interface Props {
  cameras: Camera[];
  onRemove: (id: number) => void;
  gridSize: number;
}

function CameraWall({ cameras, onRemove, gridSize }: Props) {
  const totalSlots = gridSize * gridSize;
  const visibleCameras = cameras.slice(0, totalSlots);
  const emptySlotCount = Math.max(totalSlots - visibleCameras.length, 0);
  const compact = gridSize > 8;

  return (
    <div
      className="scroll-area"
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
        gridTemplateRows: `repeat(${gridSize}, 1fr)`,
        gap: compact ? 4 : 12,
        padding: compact ? 6 : 16,
        width: "100%",
        height: "100%",
        boxSizing: "border-box",
        background: "var(--bg-app)",
      }}
    >
      {cameras.length === 0 && (
        <div
          className="empty-state"
          style={{
            gridColumn: "1 / -1",
            gridRow: "1 / -1",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          Chưa có camera nào được thêm vào Camera Wall
        </div>
      )}

      {visibleCameras.map((camera) => (
        <div
          key={camera.id}
          style={{
            minWidth: 0,
            minHeight: 0,
            background: "#000",
            overflow: "hidden",
            borderRadius: compact ? 4 : "var(--radius-md)",
            boxShadow: compact ? "none" : "var(--shadow-md)",
          }}
        >
          <CameraVideoCard camera={camera} onRemove={() => onRemove(camera.id)} />
        </div>
      ))}

      {visibleCameras.length > 0 &&
        Array.from({ length: emptySlotCount }).map((_, index) => (
          <div
            key={`empty-${index}`}
            style={{
              minWidth: 0,
              minHeight: 0,
              border: "1px dashed var(--border)",
              borderRadius: compact ? 4 : "var(--radius-md)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--text-faint)",
              fontSize: 11,
            }}
          >
            {!compact && "Trống"}
          </div>
        ))}
    </div>
  );
}

export default CameraWall;
