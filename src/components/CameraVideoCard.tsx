import type { Camera } from "../types/camera";
import type { VehicleBox } from "../types/behavior";
import HlsVideo from "./HlsVideo";
import VehicleBoxOverlay from "./VehicleBoxOverlay";

interface Props {
  camera: Camera;
  vehicleBoxes: VehicleBox[];
  onRemove: () => void;
}

function CameraVideoCard({ camera, vehicleBoxes, onRemove }: Props) {
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

      <div style={{ position: "relative", flex: 1, minHeight: 0 }}>
        <HlsVideo
          src={camera.streamUrl}
          autoPlay
          muted
          style={{
            width: "100%",
            height: "100%",
            // "fill" khi có khung xe để vẽ (đánh đổi giống ZoomableVideo/VcaPanel
            // — xem chú thích ở đó) vì ô lưới Camera Wall không cố định 16:9 như
            // panel xem 1 camera, tỉ lệ méo ít nhiều tuỳ kích thước lưới đang chọn.
            objectFit: vehicleBoxes.length > 0 ? "fill" : "contain",
            display: "block",
          }}
        />
        <VehicleBoxOverlay vehicleBoxes={vehicleBoxes} />
      </div>
    </div>
  );
}

export default CameraVideoCard;
