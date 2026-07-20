import CameraVideoCard from "./CameraVideoCard";
import type { Camera } from "../types/camera";

interface Props {
  cameras: Camera[];
  onRemove: (id: number) => void;
}

function CameraWall({ cameras, onRemove }: Props) {
  return (
    <div
      className="scroll-area"
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
        gap: 16,
        padding: 20,
        width: "100%",
        height: "100%",
        boxSizing: "border-box",
        background: "var(--bg-app)",
        alignContent: "start",
      }}
    >
      {cameras.length === 0 && (
        <div
          className="empty-state"
          style={{ gridColumn: "1 / -1", padding: 60 }}
        >
          Chưa có camera nào được thêm vào Camera Wall
        </div>
      )}

      {cameras.map((camera) => (
        <div
          key={camera.id}
          style={{
            aspectRatio: "16 / 9",
            background: "#000",
            overflow: "hidden",
            borderRadius: "var(--radius-md)",
            boxShadow: "var(--shadow-md)",
          }}
        >
          <CameraVideoCard
            camera={camera}
            onRemove={() => onRemove(camera.id)}
          />
        </div>
      ))}
    </div>
  );
}

export default CameraWall;
