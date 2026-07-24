import { useEffect, useRef, useState } from "react";
import type { Camera } from "../types/camera";
import type { VcaLine, VcaZone, VcaLineMode } from "../types/vca";
import { getVcaConfig, createVcaLine, deleteVcaLine, createVcaZone, deleteVcaZone } from "../api/client";
import { useAuth } from "../auth/AuthContext";
import HlsVideo from "./HlsVideo";

interface Props {
  onClose: () => void;
  cameras: Camera[];
}

type DrawMode = "none" | "line" | "zone";

function toPercent([x, y]: [number, number]) {
  return { left: `${x * 100}%`, top: `${y * 100}%` };
}

function VcaPanel({ onClose, cameras }: Props) {
  const { hasPermission } = useAuth();
  const canManage = hasPermission("ManageVca");

  const [selectedCameraId, setSelectedCameraId] = useState<number | null>(cameras[0]?.id ?? null);
  const selectedCamera = cameras.find((c) => c.id === selectedCameraId) ?? null;

  const [lines, setLines] = useState<VcaLine[]>([]);
  const [zones, setZones] = useState<VcaZone[]>([]);
  const [loadingConfig, setLoadingConfig] = useState(false);

  const [drawMode, setDrawMode] = useState<DrawMode>("none");
  const [drawPoints, setDrawPoints] = useState<[number, number][]>([]);
  const [shapeName, setShapeName] = useState("");
  const [newLineMode, setNewLineMode] = useState<VcaLineMode>("counting");
  const [newZoneAlertIntrusion, setNewZoneAlertIntrusion] = useState(true);
  const [newZoneAlertLoitering, setNewZoneAlertLoitering] = useState(true);
  const [newZoneLoiterSeconds, setNewZoneLoiterSeconds] = useState(60);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const overlayRef = useRef<HTMLDivElement>(null);

  const loadConfig = async (cameraId: number) => {
    setLoadingConfig(true);
    try {
      const data = await getVcaConfig(cameraId);
      setLines(data.lines);
      setZones(data.zones);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không tải được cấu hình VCA");
    } finally {
      setLoadingConfig(false);
    }
  };

  useEffect(() => {
    setDrawMode("none");
    setDrawPoints([]);
    setError(null);

    if (selectedCameraId != null) {
      loadConfig(selectedCameraId);
    } else {
      setLines([]);
      setZones([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCameraId]);

  // Số đếm line tăng ở phía backend theo thời gian thực khi có người đi qua
  // ngoài camera thật — làm mới định kỳ để hiển thị gần như trực tiếp.
  useEffect(() => {
    if (selectedCameraId == null) return;
    const interval = setInterval(() => loadConfig(selectedCameraId), 10000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCameraId]);

  const resetDraw = () => {
    setDrawMode("none");
    setDrawPoints([]);
    setShapeName("");
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (drawMode === "none" || !overlayRef.current) return;
    if (drawMode === "line" && drawPoints.length >= 2) return;

    const rect = overlayRef.current.getBoundingClientRect();
    const x = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    const y = Math.min(1, Math.max(0, (e.clientY - rect.top) / rect.height));

    setDrawPoints((prev) => [...prev, [x, y]]);
  };

  const handleSaveLine = async () => {
    if (!selectedCameraId || drawPoints.length !== 2) return;
    setSaving(true);
    setError(null);
    try {
      await createVcaLine(selectedCameraId, {
        name: shapeName.trim() || "Line",
        start: drawPoints[0],
        end: drawPoints[1],
        mode: newLineMode,
      });
      resetDraw();
      await loadConfig(selectedCameraId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lưu line thất bại");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveZone = async () => {
    if (!selectedCameraId || drawPoints.length < 3) return;
    setSaving(true);
    setError(null);
    try {
      await createVcaZone(selectedCameraId, {
        name: shapeName.trim() || "Zone",
        polygon: drawPoints,
        alertOnIntrusion: newZoneAlertIntrusion,
        alertOnLoitering: newZoneAlertLoitering,
        loiterSeconds: Math.max(5, newZoneLoiterSeconds),
      });
      resetDraw();
      await loadConfig(selectedCameraId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lưu vùng thất bại");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteLine = async (id: number) => {
    if (!selectedCameraId) return;
    try {
      await deleteVcaLine(id);
      await loadConfig(selectedCameraId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Xoá line thất bại");
    }
  };

  const handleDeleteZone = async (id: number) => {
    if (!selectedCameraId) return;
    try {
      await deleteVcaZone(id);
      await loadConfig(selectedCameraId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Xoá vùng thất bại");
    }
  };

  const polygonToPointsAttr = (polygon: [number, number][]) =>
    polygon.map(([x, y]) => `${x * 100},${y * 100}`).join(" ");

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 5000,
        background: "var(--panel-bg)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 20px",
          borderBottom: "1px solid var(--border)",
          flexShrink: 0,
        }}
      >
        <h2 style={{ margin: 0 }}>🚧 VCA — Hàng rào ảo, đếm qua line &amp; xâm nhập/lảng vảng</h2>
        <button className="btn" onClick={onClose}>
          ✕ Đóng
        </button>
      </div>

      <div
        style={{
          flex: 1,
          minHeight: 0,
          display: "grid",
          gridTemplateColumns: "260px minmax(0, 1fr) 320px",
          gap: 16,
          padding: 20,
          overflow: "hidden",
        }}
      >
        {/* Cột trái: chọn camera */}
        <div className="scroll-area" style={{ overflow: "auto", paddingRight: 4 }}>
          <h3 className="panel-title">📷 Camera</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {cameras.map((cam) => (
              <button
                key={cam.id}
                className={"btn btn-sm" + (cam.id === selectedCameraId ? " btn-active" : "")}
                style={{ textAlign: "left", justifyContent: "flex-start" }}
                onClick={() => setSelectedCameraId(cam.id)}
              >
                {cam.name}
              </button>
            ))}
          </div>
        </div>

        {/* Cột giữa: video + lớp vẽ line/zone */}
        <div className="scroll-area" style={{ overflow: "auto", paddingRight: 4 }}>
          {!selectedCamera ? (
            <div className="empty-state">Chọn 1 camera để cấu hình</div>
          ) : (
            <>
              {canManage && (
                <div style={{ display: "flex", gap: 8, marginBottom: 10, flexWrap: "wrap" }}>
                  <button
                    className={"btn btn-sm" + (drawMode === "line" ? " btn-active" : "")}
                    onClick={() => {
                      setDrawMode(drawMode === "line" ? "none" : "line");
                      setDrawPoints([]);
                    }}
                  >
                    📏 {drawMode === "line" ? "Huỷ vẽ line" : "Vẽ line"}
                  </button>
                  <button
                    className={"btn btn-sm" + (drawMode === "zone" ? " btn-active" : "")}
                    onClick={() => {
                      setDrawMode(drawMode === "zone" ? "none" : "zone");
                      setDrawPoints([]);
                    }}
                  >
                    ⬛ {drawMode === "zone" ? "Huỷ vẽ vùng" : "Vẽ vùng"}
                  </button>
                </div>
              )}

              <div
                ref={overlayRef}
                onClick={handleOverlayClick}
                style={{
                  position: "relative",
                  width: "100%",
                  aspectRatio: "16 / 9",
                  borderRadius: "var(--radius-md)",
                  overflow: "hidden",
                  background: "#000",
                  cursor: drawMode === "none" ? "default" : "crosshair",
                }}
              >
                {/* objectFit "fill" (không letterbox) là bắt buộc ở đây — toạ độ
                    chuẩn hoá 0..1 tính theo % của container này, phải khớp
                    chính xác 1:1 với khung hình gốc mà YOLO nhận (behavior-
                    service dùng xyxyn theo đúng khung hình, không có viền
                    đen). Nếu để "contain" (giữ tỉ lệ, letterbox), toạ độ vẽ
                    trên UI sẽ lệch khỏi vị trí thật khi camera không đúng
                    16:9 — đánh đổi là ảnh có thể bị kéo giãn nhẹ về hình. */}
                <HlsVideo
                  src={selectedCamera.streamUrl}
                  muted
                  autoPlay
                  style={{ width: "100%", height: "100%", objectFit: "fill" }}
                />

                <svg
                  style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                >
                  {lines.map((l) => (
                    <line
                      key={`line-${l.id}`}
                      x1={l.start[0] * 100}
                      y1={l.start[1] * 100}
                      x2={l.end[0] * 100}
                      y2={l.end[1] * 100}
                      stroke={l.mode === "tripwire" ? "#ef4444" : "#22c55e"}
                      strokeWidth={0.6}
                      vectorEffect="non-scaling-stroke"
                    />
                  ))}
                  {zones.map((z) => (
                    <polygon
                      key={`zone-${z.id}`}
                      points={polygonToPointsAttr(z.polygon)}
                      fill="rgba(234, 179, 8, 0.2)"
                      stroke="#eab308"
                      strokeWidth={0.6}
                      vectorEffect="non-scaling-stroke"
                    />
                  ))}

                  {drawMode === "line" && drawPoints.length === 2 && (
                    <line
                      x1={drawPoints[0][0] * 100}
                      y1={drawPoints[0][1] * 100}
                      x2={drawPoints[1][0] * 100}
                      y2={drawPoints[1][1] * 100}
                      stroke="#38bdf8"
                      strokeDasharray="2,1"
                      strokeWidth={0.6}
                      vectorEffect="non-scaling-stroke"
                    />
                  )}
                  {drawMode === "zone" && drawPoints.length >= 2 && (
                    <polyline
                      points={polygonToPointsAttr(drawPoints)}
                      fill="none"
                      stroke="#38bdf8"
                      strokeDasharray="2,1"
                      strokeWidth={0.6}
                      vectorEffect="non-scaling-stroke"
                    />
                  )}
                </svg>

                {drawMode !== "none" &&
                  drawPoints.map((p, i) => (
                    <div
                      key={i}
                      style={{
                        position: "absolute",
                        ...toPercent(p),
                        width: 10,
                        height: 10,
                        marginLeft: -5,
                        marginTop: -5,
                        borderRadius: "50%",
                        background: "#38bdf8",
                        border: "2px solid white",
                      }}
                    />
                  ))}
              </div>

              {drawMode === "line" && (
                <div className="panel-block" style={{ padding: 12, marginTop: 10 }}>
                  <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 8 }}>
                    Bấm 2 điểm trên video để đặt đường ảo (điểm 1 = A, điểm 2 = B).
                    Đã đặt {drawPoints.length}/2 điểm.
                  </p>
                  <input
                    className="text-input"
                    placeholder="Tên line (vd: Cổng vào)"
                    value={shapeName}
                    onChange={(e) => setShapeName(e.target.value)}
                    style={{ marginBottom: 8 }}
                  />
                  <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                    <label style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12 }}>
                      <input
                        type="radio"
                        checked={newLineMode === "counting"}
                        onChange={() => setNewLineMode("counting")}
                      />
                      Chỉ đếm (không cảnh báo)
                    </label>
                    <label style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12 }}>
                      <input
                        type="radio"
                        checked={newLineMode === "tripwire"}
                        onChange={() => setNewLineMode("tripwire")}
                      />
                      Hàng rào ảo (cảnh báo mỗi lượt qua)
                    </label>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      className="btn btn-primary btn-sm"
                      disabled={drawPoints.length !== 2 || saving}
                      onClick={handleSaveLine}
                    >
                      {saving ? "Đang lưu..." : "💾 Lưu line"}
                    </button>
                    <button className="btn btn-sm" onClick={resetDraw}>
                      Huỷ
                    </button>
                  </div>
                </div>
              )}

              {drawMode === "zone" && (
                <div className="panel-block" style={{ padding: 12, marginTop: 10 }}>
                  <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 8 }}>
                    Bấm từng điểm để vẽ vùng (tối thiểu 3 điểm). Đã đặt {drawPoints.length} điểm.
                  </p>
                  <input
                    className="text-input"
                    placeholder="Tên vùng (vd: Khu vực cấm)"
                    value={shapeName}
                    onChange={(e) => setShapeName(e.target.value)}
                    style={{ marginBottom: 8 }}
                  />
                  <div style={{ display: "flex", gap: 12, marginBottom: 8, flexWrap: "wrap" }}>
                    <label style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12 }}>
                      <input
                        type="checkbox"
                        checked={newZoneAlertIntrusion}
                        onChange={(e) => setNewZoneAlertIntrusion(e.target.checked)}
                      />
                      Cảnh báo xâm nhập
                    </label>
                    <label style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12 }}>
                      <input
                        type="checkbox"
                        checked={newZoneAlertLoitering}
                        onChange={(e) => setNewZoneAlertLoitering(e.target.checked)}
                      />
                      Cảnh báo lảng vảng sau
                    </label>
                    <input
                      type="number"
                      min={5}
                      className="text-input"
                      style={{ width: 70 }}
                      value={newZoneLoiterSeconds}
                      onChange={(e) => setNewZoneLoiterSeconds(Number(e.target.value))}
                      disabled={!newZoneAlertLoitering}
                    />
                    <span style={{ fontSize: 12, alignSelf: "center" }}>giây</span>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      className="btn btn-primary btn-sm"
                      disabled={drawPoints.length < 3 || saving}
                      onClick={handleSaveZone}
                    >
                      {saving ? "Đang lưu..." : "💾 Lưu vùng"}
                    </button>
                    <button
                      className="btn btn-sm"
                      disabled={drawPoints.length === 0}
                      onClick={() => setDrawPoints((prev) => prev.slice(0, -1))}
                    >
                      ↩️ Bỏ điểm cuối
                    </button>
                    <button className="btn btn-sm" onClick={resetDraw}>
                      Huỷ
                    </button>
                  </div>
                </div>
              )}

              {error && (
                <p style={{ color: "var(--danger)", fontSize: 12, marginTop: 8 }}>{error}</p>
              )}

              {!canManage && (
                <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 10 }}>
                  Bạn không có quyền chỉnh sửa cấu hình VCA — chỉ xem được line/vùng hiện có.
                </p>
              )}
            </>
          )}
        </div>

        {/* Cột phải: danh sách line/zone đã cấu hình */}
        <div className="scroll-area" style={{ overflow: "auto", paddingRight: 4 }}>
          <h3 className="panel-title">📏 Line ({lines.length})</h3>
          {loadingConfig && <div style={{ fontSize: 12, color: "var(--text-faint)" }}>Đang tải...</div>}
          {!loadingConfig && lines.length === 0 && <div className="empty-state">Chưa có line nào</div>}

          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
            {lines.map((l) => (
              <div key={l.id} className="card" style={{ padding: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <b style={{ fontSize: 13 }}>
                    {l.mode === "tripwire" ? "🚨" : "🔢"} {l.name}
                  </b>
                  {canManage && (
                    <button
                      className="btn btn-icon btn-ghost"
                      title="Xoá"
                      onClick={() => handleDeleteLine(l.id)}
                    >
                      🗑️
                    </button>
                  )}
                </div>
                <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>
                  {l.mode === "tripwire" ? "Hàng rào ảo — báo mỗi lượt qua" : "Chỉ đếm"}
                </div>
                <div style={{ fontSize: 12, marginTop: 4, display: "flex", gap: 12 }}>
                  <span>A→B: <b>{l.crossCountAtoB}</b></span>
                  <span>B→A: <b>{l.crossCountBtoA}</b></span>
                </div>
              </div>
            ))}
          </div>

          <h3 className="panel-title">⬛ Vùng ({zones.length})</h3>
          {!loadingConfig && zones.length === 0 && <div className="empty-state">Chưa có vùng nào</div>}

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {zones.map((z) => (
              <div key={z.id} className="card" style={{ padding: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <b style={{ fontSize: 13 }}>⬛ {z.name}</b>
                  {canManage && (
                    <button
                      className="btn btn-icon btn-ghost"
                      title="Xoá"
                      onClick={() => handleDeleteZone(z.id)}
                    >
                      🗑️
                    </button>
                  )}
                </div>
                <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>
                  {z.alertOnIntrusion && "Xâm nhập"}
                  {z.alertOnIntrusion && z.alertOnLoitering && " · "}
                  {z.alertOnLoitering && `Lảng vảng ≥${z.loiterSeconds}s`}
                  {!z.alertOnIntrusion && !z.alertOnLoitering && "Không cảnh báo"}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default VcaPanel;
