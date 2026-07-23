import type { Camera } from "../types/camera";
import HlsVideo from "./HlsVideo";

interface Props {
  camera: Camera;
  onRemove: () => void;
}

function CameraVideoCard({ camera, onRemove }: Props) {
  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        background: "#000",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "8px 10px",
          background: "rgba(17,17,17,.85)",
          color: "#fff",
          flexShrink: 0,
        }}
      >
        <span
          style={{
            fontSize: 13,
            fontWeight: 500,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          📷 {camera.name}
        </span>
        <button
          className="btn btn-icon btn-ghost"
          onClick={onRemove}
          title="Bỏ khỏi Camera Wall"
          style={{ color: "#fff", width: 26, height: 26 }}
        >
          ✕
        </button>
      </div>

      <HlsVideo
        src={camera.streamUrl}
        autoPlay
        muted
        style={{
          width: "100%",
          flex: 1,
          minHeight: 0,
          objectFit: "contain",
          display: "block",
        }}
      />
    </div>
  );
}

export default CameraVideoCard;
