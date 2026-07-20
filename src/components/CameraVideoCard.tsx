import type { Camera } from "../types/camera";

interface Props {
  camera: Camera;
  onRemove: () => void;
}

function CameraVideoCard({ camera, onRemove }: Props) {
  return (
    <div
      style={{
        height: "100%",
        border: "1px solid #ddd",
        borderRadius: 8,
        overflow: "hidden",
        background: "#000",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: 8,
          background: "#111",
          color: "#fff",
        }}
      >
        <span>📷 {camera.name}</span>
        <button onClick={onRemove}>✕</button>
      </div>

      <video
        src={camera.streamUrl}
        autoPlay
        muted
        playsInline
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
          display: "block",
        }}
      />
    </div>
  );
}

export default CameraVideoCard;
