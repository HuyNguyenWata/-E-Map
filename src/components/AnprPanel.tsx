import { useState } from "react";
import usePlateEntries from "../hooks/usePlateEntries";
import usePlateDetections from "../hooks/usePlateDetections";
import { detectPlatesInImage } from "../api/anprService";
import type { AnprDetectionResult } from "../api/anprService";
import type { PlateListType } from "../types/anpr";
import type { Zone } from "../types/zone";
import type { RoutePoint } from "./PlateRouteLayer";
import { useAuth } from "../auth/AuthContext";

interface Props {
  onClose: () => void;
  onLocate: (lat: number, lng: number) => void;
  onShowRoute: (plateNumber: string, points: RoutePoint[]) => void;
  zones: Zone[];
  onToggleZoneWatch: (zoneId: number, enabled: boolean) => Promise<unknown>;
}

function matchBadge(matched: PlateListType | null) {
  if (matched === "blacklist") {
    return <span className="badge badge-critical">🚫 Blacklist</span>;
  }
  if (matched === "whitelist") {
    return <span className="badge badge-online">✅ Whitelist</span>;
  }
  return <span className="badge badge-offline">Không khớp</span>;
}

function AnprPanel({ onClose, onLocate, onShowRoute, zones, onToggleZoneWatch }: Props) {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const { entries, loading: entriesLoading, addEntry, removeEntry } = usePlateEntries();
  const [zoneWatchPending, setZoneWatchPending] = useState<number | null>(null);

  const handleToggleZoneWatch = async (zoneId: number, enabled: boolean) => {
    setZoneWatchPending(zoneId);
    try {
      await onToggleZoneWatch(zoneId, enabled);
    } catch (err) {
      console.error("Không đổi được trạng thái giám sát zone:", err);
    } finally {
      setZoneWatchPending(null);
    }
  };
  const [tracedPlate, setTracedPlate] = useState<string | null>(null);
  const { detections, loading: detectionsLoading, refresh: refreshDetections } =
    usePlateDetections(tracedPlate ?? undefined, tracedPlate ? 100 : 20);

  const [newPlate, setNewPlate] = useState("");
  const [newListType, setNewListType] = useState<PlateListType>("blacklist");
  const [newDescription, setNewDescription] = useState("");
  const [entryError, setEntryError] = useState<string | null>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [detecting, setDetecting] = useState(false);
  const [detectError, setDetectError] = useState<string | null>(null);
  const [lastResults, setLastResults] = useState<AnprDetectionResult[] | null>(null);

  const handleFileChange = (file: File | null) => {
    setSelectedFile(file);
    setLastResults(null);
    setDetectError(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(file ? URL.createObjectURL(file) : null);
  };

  const handleAddEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlate.trim()) {
      setEntryError("Biển số không được để trống");
      return;
    }

    setEntryError(null);

    try {
      await addEntry({ plateNumber: newPlate, listType: newListType, description: newDescription });
      setNewPlate("");
      setNewDescription("");
    } catch (err) {
      setEntryError(err instanceof Error ? err.message : "Có lỗi xảy ra");
    }
  };

  const handleShowRoute = () => {
    if (!tracedPlate) return;

    // detections trả về mới nhất trước — đảo lại để vẽ lộ trình theo đúng
    // thứ tự thời gian di chuyển (điểm đầu -> điểm cuối).
    const points: RoutePoint[] = [...detections]
      .filter((d) => d.latitude != null && d.longitude != null)
      .reverse()
      .map((d) => ({ lat: d.latitude as number, lng: d.longitude as number, detectedAt: d.detectedAt }));

    if (points.length === 0) return;

    onShowRoute(tracedPlate, points);
    onClose();
  };

  const handleDetect = async () => {
    if (!selectedFile) return;

    setDetecting(true);
    setDetectError(null);

    try {
      const results = await detectPlatesInImage(selectedFile);
      setLastResults(results);
      refreshDetections();
    } catch (err) {
      setDetectError(err instanceof Error ? err.message : "Nhận diện thất bại");
    } finally {
      setDetecting(false);
    }
  };

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
        <h2 style={{ margin: 0 }}>🚗 ANPR — Nhận dạng biển số</h2>
        <button className="btn" onClick={onClose}>
          ✕ Đóng
        </button>
      </div>

      <div
        style={{
          flex: 1,
          minHeight: 0,
          display: "grid",
          gridTemplateColumns: "320px minmax(0, 1fr) 360px",
          gap: 16,
          padding: 20,
          overflow: "hidden",
        }}
      >
        {/* Cột trái: Danh sách đen/trắng */}
        <div className="scroll-area" style={{ overflow: "auto", paddingRight: 4 }}>
          <h3 className="panel-title">📋 Danh sách đen/trắng</h3>

          {isAdmin && (
            <form
              onSubmit={handleAddEntry}
              className="panel-block"
              style={{ padding: 12, marginBottom: 12 }}
            >
              <input
                className="text-input"
                placeholder="Biển số (vd 51F-371.95)"
                value={newPlate}
                onChange={(e) => setNewPlate(e.target.value)}
                style={{ marginBottom: 8 }}
              />

              <select
                className="select-input"
                value={newListType}
                onChange={(e) => setNewListType(e.target.value as PlateListType)}
                style={{ marginBottom: 8 }}
              >
                <option value="blacklist">🚫 Blacklist</option>
                <option value="whitelist">✅ Whitelist</option>
              </select>

              <input
                className="text-input"
                placeholder="Mô tả"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                style={{ marginBottom: 8 }}
              />

              {entryError && (
                <p style={{ color: "var(--danger)", fontSize: 12, marginBottom: 8 }}>{entryError}</p>
              )}

              <button type="submit" className="btn btn-primary btn-block">
                + Thêm vào danh sách
              </button>
            </form>
          )}

          {entriesLoading && (
            <div style={{ fontSize: 12, color: "var(--text-faint)" }}>Đang tải...</div>
          )}

          {!entriesLoading && entries.length === 0 && (
            <div className="empty-state">Chưa có biển số nào trong danh sách</div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {entries.map((entry) => (
              <div key={entry.id} className="card" style={{ padding: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <b style={{ fontSize: 13 }}>{entry.plateNumber}</b>
                    <div style={{ marginTop: 4 }}>
                      {entry.listType === "blacklist" ? (
                        <span className="badge badge-critical">🚫 Blacklist</span>
                      ) : (
                        <span className="badge badge-online">✅ Whitelist</span>
                      )}
                    </div>
                  </div>

                  {isAdmin && (
                    <button
                      className="btn btn-icon btn-ghost"
                      title="Xoá"
                      onClick={() => removeEntry(entry.id)}
                    >
                      🗑️
                    </button>
                  )}
                </div>

                {entry.description && (
                  <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>
                    {entry.description}
                  </div>
                )}
              </div>
            ))}
          </div>

          <h3 className="panel-title" style={{ marginTop: 20 }}>
            🛰️ Khoanh vùng giám sát
          </h3>
          <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: -8, marginBottom: 10 }}>
            Bật giám sát một khu vực: mọi biển số camera trong khu vực đó phát hiện được
            sẽ tự tạo cảnh báo, kể cả khi không nằm trong danh sách đen.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {zones.map((zone) => (
              <div
                key={zone.id}
                className="card"
                style={{ padding: 10, display: "flex", alignItems: "center", justifyContent: "space-between" }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: 2,
                      background: zone.color,
                      display: "inline-block",
                    }}
                  />
                  <b style={{ fontSize: 13 }}>{zone.name}</b>
                </div>

                {isAdmin ? (
                  <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
                    <span style={{ fontSize: 11, color: "var(--text-muted)" }}>
                      {zoneWatchPending === zone.id ? "..." : zone.isAnprWatched ? "Đang bật" : "Tắt"}
                    </span>
                    <input
                      type="checkbox"
                      checked={zone.isAnprWatched}
                      disabled={zoneWatchPending === zone.id}
                      onChange={(e) => handleToggleZoneWatch(zone.id, e.target.checked)}
                    />
                  </label>
                ) : zone.isAnprWatched ? (
                  <span className="badge badge-warning">🛰️ Đang giám sát</span>
                ) : (
                  <span className="badge badge-offline">Tắt</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Cột giữa: Upload ảnh test */}
        <div className="scroll-area" style={{ overflow: "auto", paddingRight: 4 }}>
          <h3 className="panel-title">📷 Nhận diện từ ảnh</h3>

          <div className="panel-block" style={{ padding: 14, marginBottom: 14 }}>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e.target.files?.[0] ?? null)}
              style={{ marginBottom: 10 }}
            />

            {previewUrl && (
              <img
                src={previewUrl}
                alt="preview"
                style={{ width: "100%", borderRadius: "var(--radius-md)", marginBottom: 10 }}
              />
            )}

            <button
              className="btn btn-primary btn-block"
              onClick={handleDetect}
              disabled={!selectedFile || detecting}
            >
              {detecting ? "Đang nhận diện..." : "Nhận diện biển số"}
            </button>

            {detectError && (
              <p style={{ color: "var(--danger)", fontSize: 12, marginTop: 8 }}>{detectError}</p>
            )}
          </div>

          {lastResults && (
            <div>
              <h4 style={{ marginBottom: 8 }}>Kết quả ({lastResults.length})</h4>

              {lastResults.length === 0 && (
                <div className="empty-state">Không phát hiện được biển số nào trong ảnh</div>
              )}

              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {lastResults.map((r, i) => (
                  <div key={i} className="card" style={{ padding: 10 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 6 }}>
                      <b style={{ fontSize: 14 }}>{r.plateNumber}</b>
                      <div style={{ display: "flex", gap: 4 }}>
                        {r.saved.inWatchedZone && (
                          <span className="badge badge-warning">🛰️ Vùng giám sát</span>
                        )}
                        {matchBadge(r.saved.matchedListType)}
                      </div>
                    </div>
                    <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>
                      Độ tin cậy: {(r.confidence * 100).toFixed(1)}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Cột phải: Feed detection + truy vết */}
        <div className="scroll-area" style={{ overflow: "auto", paddingRight: 4 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <h3 className="panel-title" style={{ margin: 0 }}>
              {tracedPlate ? `📍 Lộ trình: ${tracedPlate}` : "🕒 Detection gần đây"}
            </h3>

            {tracedPlate && (
              <div style={{ display: "flex", gap: 6 }}>
                <button
                  className="btn btn-sm btn-primary"
                  onClick={handleShowRoute}
                  disabled={
                    detections.filter((d) => d.latitude != null && d.longitude != null).length < 2
                  }
                  title="Vẽ đường di chuyển của biển số này lên bản đồ"
                >
                  🗺️ Vẽ lộ trình
                </button>
                <button className="btn btn-sm" onClick={() => setTracedPlate(null)}>
                  ✕ Bỏ truy vết
                </button>
              </div>
            )}
          </div>

          {!tracedPlate && (
            <p style={{ fontSize: 12, color: "var(--text-faint)", marginTop: 4 }}>
              Bấm vào biển số (🛰️) bên dưới để truy vết lộ trình di chuyển.
            </p>
          )}

          {tracedPlate &&
            !detectionsLoading &&
            detections.filter((d) => d.latitude != null && d.longitude != null).length < 2 && (
              <p style={{ fontSize: 12, color: "var(--text-faint)", marginTop: 6 }}>
                Cần ít nhất 2 lần phát hiện có toạ độ camera để vẽ lộ trình di chuyển.
              </p>
            )}

          {detectionsLoading && (
            <div style={{ fontSize: 12, color: "var(--text-faint)", marginTop: 8 }}>Đang tải...</div>
          )}

          {!detectionsLoading && detections.length === 0 && (
            <div className="empty-state">Chưa có detection nào</div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 8 }}>
            {detections.map((d) => (
              <div key={d.id} className="card" style={{ padding: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <b
                    style={{
                      fontSize: 13,
                      cursor: "pointer",
                      color: "var(--primary-dark)",
                      textDecoration: "underline",
                      textUnderlineOffset: 3,
                    }}
                    onClick={() => setTracedPlate(d.plateNumber)}
                    title="Bấm để truy vết lộ trình di chuyển của biển số này"
                  >
                    🛰️ {d.plateNumber}
                  </b>
                  <div style={{ display: "flex", gap: 4 }}>
                    {d.inWatchedZone && <span className="badge badge-warning">🛰️ Vùng giám sát</span>}
                    {matchBadge(d.matchedListType)}
                  </div>
                </div>

                <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>
                  {d.cameraName ?? "Không rõ camera"} · {d.detectedAt}
                </div>

                {d.latitude != null && d.longitude != null && (
                  <button
                    className="btn btn-sm"
                    style={{ marginTop: 6 }}
                    onClick={() => {
                      onLocate(d.latitude!, d.longitude!);
                      onClose();
                    }}
                  >
                    🗺️ Xem trên bản đồ
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnprPanel;
