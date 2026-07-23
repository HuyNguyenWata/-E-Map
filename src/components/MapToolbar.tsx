import { useAuth } from "../auth/AuthContext";

interface Props {
  showHeatmap: boolean;

  setShowHeatmap: (value: boolean) => void;

  showCamera: boolean;

  setShowCamera: (value: boolean) => void;

  fullscreen: () => void;

  reset: () => void;
  drawZone: boolean;

  onToggleDrawZone: () => void;

  radiusMode: boolean;

  onToggleRadiusMode: () => void;

  onOpenAnpr: () => void;

  onOpenFace: () => void;

  onOpenBehavior: () => void;
}

function MapToolbar({
  showHeatmap,

  setShowHeatmap,

  showCamera,

  setShowCamera,

  fullscreen,

  reset,
  drawZone,
  onToggleDrawZone,
  radiusMode,
  onToggleRadiusMode,
  onOpenAnpr,
  onOpenFace,
  onOpenBehavior,
}: Props) {
  const { user } = useAuth();

  return (
    <div className="map-toolbar">
      <button
        className={"btn" + (showHeatmap ? " btn-active" : "")}
        onClick={() => setShowHeatmap(!showHeatmap)}
        title="Bật/tắt lớp nhiệt"
      >
        🔥 Heatmap
      </button>

      <button
        className={"btn" + (showCamera ? " btn-active" : "")}
        onClick={() => setShowCamera(!showCamera)}
        title="Bật/tắt camera"
      >
        📷 Camera
      </button>

      <button className="btn" onClick={reset} title="Đưa bản đồ về vị trí gốc">
        🎯 Reset
      </button>

      <button className="btn" onClick={fullscreen} title="Toàn màn hình">
        ⛶ Fullscreen
      </button>

      {user?.role === "admin" && (
        <button
          className={"btn" + (drawZone ? " btn-active" : "")}
          onClick={onToggleDrawZone}
          title="Vẽ khu vực mới"
        >
          {drawZone ? "✕ Hủy vẽ" : "✏️ Vẽ Zone"}
        </button>
      )}

      <button
        className={"btn" + (radiusMode ? " btn-active" : "")}
        onClick={onToggleRadiusMode}
        title="Tìm kiếm vị trí & khoanh vùng bán kính giám sát"
      >
        {radiusMode ? "✕ Hủy bán kính" : "📍 Bán kính"}
      </button>

      <button className="btn" onClick={onOpenAnpr} title="Nhận dạng biển số xe (ANPR)">
        🚗 ANPR
      </button>

      <button className="btn" onClick={onOpenFace} title="Nhận dạng khuôn mặt & điểm danh">
        🧑 Khuôn mặt
      </button>

      <button className="btn" onClick={onOpenBehavior} title="Phát hiện đám đông & vũ khí">
        🏃 Hành vi
      </button>
    </div>
  );
}

export default MapToolbar;
