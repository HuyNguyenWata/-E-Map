import CameraVideoCard from "./CameraVideoCard";
import type { Camera } from "../types/camera";

interface Props {
  cameras: Camera[];
  onRemove: (id: number) => void;
}

function CameraWall({ cameras, onRemove }: Props) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
        gap: 10,
        padding: 10,
        width: "100%",
        height: "100%",
        overflowY: "auto",
        boxSizing: "border-box",
      }}
    >
      {cameras.map((camera) => (
        <div
          key={camera.id}
          style={{
            aspectRatio: "16 / 9",
            background: "#000",
            overflow: "hidden",
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
