interface Props {
  showHeatmap: boolean;

  setShowHeatmap: (value: boolean) => void;

  showCamera: boolean;

  setShowCamera: (value: boolean) => void;

  fullscreen: () => void;

  reset: () => void;
  drawZone: boolean;

  setDrawZone: React.Dispatch<React.SetStateAction<boolean>>;
}

function MapToolbar({
  showHeatmap,

  setShowHeatmap,

  showCamera,

  setShowCamera,

  fullscreen,

  reset,
  drawZone,
  setDrawZone,
}: Props) {
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

      <button
        className={"btn" + (drawZone ? " btn-active" : "")}
        onClick={() => setDrawZone((prev) => !prev)}
        title="Vẽ khu vực mới"
      >
        {drawZone ? "✕ Hủy vẽ" : "✏️ Vẽ Zone"}
      </button>
    </div>
  );
}

export default MapToolbar;
