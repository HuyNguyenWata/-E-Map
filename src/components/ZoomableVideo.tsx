import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import HlsVideo from "./HlsVideo";

interface Props {
  src: string;
  controls?: boolean;
  muted?: boolean;
  autoPlay?: boolean;
  style?: React.CSSProperties;
}

const MIN_ZOOM = 1;
const MAX_ZOOM = 4;
const ZOOM_STEP = 0.5;

interface DragState {
  startX: number;
  startY: number;
  startPanX: number;
  startPanY: number;
}

// "Zoom kỹ thuật số" theo spec — phóng to/kéo (pan) trên khung hình phía
// client, không cần camera thật hỗ trợ optical zoom. transform dùng thứ tự
// translate(...) scale(...) (translate ở NGOÀI scale trong danh sách hàm CSS)
// để % pan luôn tương ứng đúng % khung hình bất kể đang zoom bao nhiêu lần —
// nếu đảo ngược thứ tự, kéo chuột sẽ di chuyển nhanh/chậm khác nhau tuỳ mức zoom.
function clampPan(zoom: number, x: number, y: number) {
  if (zoom <= 1) return { x: 0, y: 0 };
  const max = ((zoom - 1) / 2) * 100;
  return { x: Math.max(-max, Math.min(max, x)), y: Math.max(-max, Math.min(max, y)) };
}

function ZoomableVideo({ src, controls, muted, autoPlay, style }: Props) {
  const { t } = useTranslation();
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<DragState | null>(null);

  const applyZoom = (next: number) => {
    const clamped = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, next));
    setZoom(clamped);
    setPan((p) => clampPan(clamped, p.x, p.y));
  };

  const handleZoomIn = () => applyZoom(zoom + ZOOM_STEP);
  const handleZoomOut = () => applyZoom(zoom - ZOOM_STEP);
  const handleReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    applyZoom(zoom + (e.deltaY < 0 ? ZOOM_STEP : -ZOOM_STEP));
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (zoom <= 1) return;
    (e.target as Element).setPointerCapture(e.pointerId);
    dragRef.current = { startX: e.clientX, startY: e.clientY, startPanX: pan.x, startPanY: pan.y };
    setDragging(true);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    const drag = dragRef.current;
    const container = containerRef.current;
    if (!drag || !container) return;

    const rect = container.getBoundingClientRect();
    const dxPercent = ((e.clientX - drag.startX) / rect.width) * 100;
    const dyPercent = ((e.clientY - drag.startY) / rect.height) * 100;
    setPan(clampPan(zoom, drag.startPanX + dxPercent, drag.startPanY + dyPercent));
  };

  const handlePointerUp = () => {
    dragRef.current = null;
    setDragging(false);
  };

  return (
    <div
      ref={containerRef}
      style={{ position: "relative", overflow: "hidden", touchAction: "none", ...style }}
      onWheel={handleWheel}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      <HlsVideo
        src={src}
        controls={controls}
        muted={muted}
        autoPlay={autoPlay}
        style={{
          width: "100%",
          height: "100%",
          display: "block",
          objectFit: "contain",
          background: "#000",
          transform: `translate(${pan.x}%, ${pan.y}%) scale(${zoom})`,
          transformOrigin: "center center",
          transition: dragging ? "none" : "transform 120ms ease-out",
          cursor: zoom > 1 ? (dragging ? "grabbing" : "grab") : "default",
        }}
      />

      <div
        style={{
          position: "absolute",
          top: 8,
          right: 8,
          display: "flex",
          alignItems: "center",
          gap: 4,
          background: "rgba(0,0,0,0.55)",
          borderRadius: "var(--radius-md)",
          padding: "4px 6px",
        }}
      >
        <button
          type="button"
          className="btn btn-icon btn-ghost"
          style={{ color: "#fff", padding: "2px 8px" }}
          title={t("cameraDetail.zoomOut")}
          onClick={handleZoomOut}
          disabled={zoom <= MIN_ZOOM}
        >
          −
        </button>
        <span style={{ color: "#fff", fontSize: 12, minWidth: 32, textAlign: "center" }}>
          {zoom.toFixed(1)}x
        </span>
        <button
          type="button"
          className="btn btn-icon btn-ghost"
          style={{ color: "#fff", padding: "2px 8px" }}
          title={t("cameraDetail.zoomIn")}
          onClick={handleZoomIn}
          disabled={zoom >= MAX_ZOOM}
        >
          +
        </button>
        {zoom > 1 && (
          <button
            type="button"
            className="btn btn-icon btn-ghost"
            style={{ color: "#fff", fontSize: 11, padding: "2px 8px" }}
            title={t("cameraDetail.zoomReset")}
            onClick={handleReset}
          >
            {t("cameraDetail.zoomReset")}
          </button>
        )}
      </div>
    </div>
  );
}

export default ZoomableVideo;
