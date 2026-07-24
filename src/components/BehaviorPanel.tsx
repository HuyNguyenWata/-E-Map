import { useState } from "react";
import useBehaviorSettings from "../hooks/useBehaviorSettings";
import useBehaviorDetections from "../hooks/useBehaviorDetections";
import { detectCrowd, detectWeapon, detectLitter } from "../api/behaviorService";
import type { CrowdDetectResult, WeaponDetectResult, LitterDetectResult } from "../api/behaviorService";
import { useAuth } from "../auth/AuthContext";
import type { Camera } from "../types/camera";

interface Props {
  onClose: () => void;
  cameras: Camera[];
}

type LastResult =
  | { kind: "crowd"; result: CrowdDetectResult }
  | { kind: "weapon"; result: WeaponDetectResult }
  | { kind: "litter"; result: LitterDetectResult };

function BehaviorPanel({ onClose, cameras }: Props) {
  const { hasPermission } = useAuth();
  const isAdmin = hasPermission("ManageBehaviorSettings");

  const { settings, loading: settingsLoading, save: saveSettings } = useBehaviorSettings();
  const { detections, loading: detectionsLoading, refresh: refreshDetections } =
    useBehaviorDetections(undefined, 30);

  // --- Cấu hình ngưỡng đám đông ---
  const [thresholdInput, setThresholdInput] = useState("");
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsError, setSettingsError] = useState<string | null>(null);

  const currentThreshold = thresholdInput !== "" ? thresholdInput : String(settings?.crowdThreshold ?? "");

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    const value = Number(currentThreshold);
    if (!Number.isFinite(value) || value < 1) {
      setSettingsError("Ngưỡng phải là số nguyên >= 1");
      return;
    }

    setSavingSettings(true);
    setSettingsError(null);

    try {
      await saveSettings(Math.round(value));
      setThresholdInput("");
    } catch (err) {
      setSettingsError(err instanceof Error ? err.message : "Lưu cấu hình thất bại");
    } finally {
      setSavingSettings(false);
    }
  };

  // --- Upload ảnh test ---
  const [testCameraId, setTestCameraId] = useState<string>("");
  const [testFile, setTestFile] = useState<File | null>(null);
  const [testPreviewUrl, setTestPreviewUrl] = useState<string | null>(null);
  const [detecting, setDetecting] = useState<"crowd" | "weapon" | "litter" | null>(null);
  const [detectError, setDetectError] = useState<string | null>(null);
  const [lastResult, setLastResult] = useState<LastResult | null>(null);

  const handleTestFileChange = (file: File | null) => {
    setTestFile(file);
    setLastResult(null);
    setDetectError(null);
    if (testPreviewUrl) URL.revokeObjectURL(testPreviewUrl);
    setTestPreviewUrl(file ? URL.createObjectURL(file) : null);
  };

  const handleDetectCrowd = async () => {
    if (!testFile) return;

    setDetecting("crowd");
    setDetectError(null);

    try {
      const cameraId = testCameraId ? Number(testCameraId) : undefined;
      const result = await detectCrowd(testFile, cameraId);
      setLastResult({ kind: "crowd", result });
      refreshDetections();
    } catch (err) {
      setDetectError(err instanceof Error ? err.message : "Đếm người thất bại");
    } finally {
      setDetecting(null);
    }
  };

  const handleDetectWeapon = async () => {
    if (!testFile) return;

    setDetecting("weapon");
    setDetectError(null);

    try {
      const cameraId = testCameraId ? Number(testCameraId) : undefined;
      const result = await detectWeapon(testFile, cameraId);
      setLastResult({ kind: "weapon", result });
      refreshDetections();
    } catch (err) {
      setDetectError(err instanceof Error ? err.message : "Phát hiện vũ khí thất bại");
    } finally {
      setDetecting(null);
    }
  };

  const handleDetectLitter = async () => {
    if (!testFile) return;

    setDetecting("litter");
    setDetectError(null);

    try {
      const cameraId = testCameraId ? Number(testCameraId) : undefined;
      const result = await detectLitter(testFile, cameraId);
      setLastResult({ kind: "litter", result });
      refreshDetections();
    } catch (err) {
      setDetectError(err instanceof Error ? err.message : "Phát hiện rác thất bại");
    } finally {
      setDetecting(null);
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
        <h2 style={{ margin: 0 }}>🏃 AI Hành vi — Đám đông, Vũ khí &amp; Vứt rác</h2>
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
        {/* Cột trái: Cấu hình ngưỡng đám đông */}
        <div className="scroll-area" style={{ overflow: "auto", paddingRight: 4 }}>
          <h3 className="panel-title">⚙️ Ngưỡng cảnh báo đám đông</h3>

          <div className="panel-block" style={{ padding: 14, marginBottom: 14 }}>
            {settingsLoading ? (
              <div style={{ fontSize: 12, color: "var(--text-faint)" }}>Đang tải...</div>
            ) : (
              <>
                <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 10 }}>
                  Số người trong khung hình từ ngưỡng này trở lên sẽ tạo cảnh báo
                  "Đám đông tụ tập bất thường".
                </p>

                {isAdmin ? (
                  <form onSubmit={handleSaveSettings}>
                    <input
                      type="number"
                      min={1}
                      className="text-input"
                      value={currentThreshold}
                      onChange={(e) => setThresholdInput(e.target.value)}
                      style={{ marginBottom: 8 }}
                    />

                    {settingsError && (
                      <p style={{ color: "var(--danger)", fontSize: 12, marginBottom: 8 }}>
                        {settingsError}
                      </p>
                    )}

                    <button
                      type="submit"
                      className="btn btn-primary btn-block"
                      disabled={savingSettings}
                    >
                      {savingSettings ? "Đang lưu..." : "Lưu ngưỡng"}
                    </button>
                  </form>
                ) : (
                  <div style={{ fontSize: 20, fontWeight: 700 }}>
                    {settings?.crowdThreshold} người
                  </div>
                )}
              </>
            )}
          </div>

          <div className="panel-block" style={{ padding: 14, marginBottom: 14 }}>
            <p style={{ fontSize: 12, color: "var(--text-muted)" }}>
              🔫 Phát hiện vũ khí không cần ngưỡng — chỉ cần phát hiện 1 khẩu súng
              trong khung hình là tạo cảnh báo Critical ngay lập tức.
            </p>
          </div>

          <div className="panel-block" style={{ padding: 14 }}>
            <p style={{ fontSize: 12, color: "var(--text-muted)" }}>
              🗑️ Phát hiện vứt rác: nhận diện vật dụng kiểu rác (chai, ly) bằng
              YOLO, chỉ xác nhận là "bị bỏ lại" nếu thấy đúng vật đó nằm yên
              tại cùng 1 vị trí qua ít nhất 2 lần lấy mẫu camera liên tiếp
              (~10s) — tránh báo nhầm người đang cầm/mang theo đồ.
            </p>
          </div>
        </div>

        {/* Cột giữa: Upload ảnh test */}
        <div className="scroll-area" style={{ overflow: "auto", paddingRight: 4 }}>
          <h3 className="panel-title">📷 Thử phát hiện từ ảnh</h3>

          <div className="panel-block" style={{ padding: 14, marginBottom: 14 }}>
            <span className="field-label">Gắn với camera (tuỳ chọn)</span>
            <select
              className="select-input"
              value={testCameraId}
              onChange={(e) => setTestCameraId(e.target.value)}
              style={{ marginBottom: 10 }}
            >
              <option value="">-- Không gắn camera (chỉ test model) --</option>
              {cameras.map((cam) => (
                <option key={cam.id} value={cam.id}>
                  {cam.name}
                </option>
              ))}
            </select>

            {!testCameraId && (
              <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: -6, marginBottom: 10 }}>
                Không gắn camera thì kết quả chỉ để tham khảo — sẽ KHÔNG tạo cảnh báo và
                KHÔNG gửi email, vì cảnh báo luôn phải gắn với 1 camera cụ thể.
              </p>
            )}

            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleTestFileChange(e.target.files?.[0] ?? null)}
              style={{ marginBottom: 10 }}
            />

            {testPreviewUrl && (
              <img
                src={testPreviewUrl}
                alt="preview"
                style={{ width: "100%", borderRadius: "var(--radius-md)", marginBottom: 10 }}
              />
            )}

            <div style={{ display: "flex", gap: 8 }}>
              <button
                className="btn btn-primary"
                style={{ flex: 1 }}
                onClick={handleDetectCrowd}
                disabled={!testFile || detecting !== null}
              >
                {detecting === "crowd" ? "Đang đếm..." : "👥 Đếm người"}
              </button>

              <button
                className="btn btn-primary"
                style={{ flex: 1 }}
                onClick={handleDetectWeapon}
                disabled={!testFile || detecting !== null}
              >
                {detecting === "weapon" ? "Đang quét..." : "🔫 Phát hiện vũ khí"}
              </button>
            </div>

            <button
              className="btn btn-primary btn-block"
              style={{ marginTop: 8 }}
              onClick={handleDetectLitter}
              disabled={!testFile || detecting !== null}
            >
              {detecting === "litter" ? "Đang quét..." : "🗑️ Phát hiện rác (bấm 2 lần để xác nhận)"}
            </button>

            {detectError && (
              <p style={{ color: "var(--danger)", fontSize: 12, marginTop: 8 }}>{detectError}</p>
            )}
          </div>

          {lastResult && lastResult.kind === "crowd" && (
            <div className="card" style={{ padding: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <b style={{ fontSize: 14 }}>Số người phát hiện</b>
                <span style={{ fontSize: 22, fontWeight: 700 }}>
                  {lastResult.result.personCount}
                </span>
              </div>

              {lastResult.result.saved?.triggeredAlert ? (
                lastResult.result.saved?.cameraId != null ? (
                  <span className="badge badge-critical" style={{ marginTop: 8 }}>
                    🚨 Vượt ngưỡng — đã tạo cảnh báo + gửi email (nếu Critical)
                  </span>
                ) : (
                  <span className="badge badge-offline" style={{ marginTop: 8 }}>
                    Vượt ngưỡng, nhưng chưa gắn camera — không tạo cảnh báo/email
                  </span>
                )
              ) : (
                <span className="badge badge-online" style={{ marginTop: 8 }}>
                  ✅ Trong ngưỡng bình thường
                </span>
              )}
            </div>
          )}

          {lastResult && lastResult.kind === "weapon" && (
            <div className="card" style={{ padding: 12 }}>
              <b style={{ fontSize: 14 }}>
                Kết quả ({lastResult.result.detections.length} phát hiện)
              </b>

              {lastResult.result.detections.length === 0 ? (
                <div className="empty-state" style={{ marginTop: 8 }}>
                  Không phát hiện vũ khí trong ảnh
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 8 }}>
                  {lastResult.result.detections.map((d, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between" }}>
                      <span>{d.label}</span>
                      <b>{(d.confidence * 100).toFixed(1)}%</b>
                    </div>
                  ))}
                  {lastResult.result.saved?.cameraId != null ? (
                    <span className="badge badge-critical" style={{ marginTop: 4 }}>
                      🚨 Đã tạo cảnh báo Critical + gửi email
                    </span>
                  ) : (
                    <span className="badge badge-offline" style={{ marginTop: 4 }}>
                      Chưa gắn camera — không tạo cảnh báo/email
                    </span>
                  )}
                </div>
              )}
            </div>
          )}

          {lastResult && lastResult.kind === "litter" && (
            <div className="card" style={{ padding: 12 }}>
              <b style={{ fontSize: 14 }}>
                Vật dụng kiểu rác trong khung hình ({lastResult.result.candidates.length})
              </b>

              {lastResult.result.candidates.length === 0 ? (
                <div className="empty-state" style={{ marginTop: 8 }}>
                  Không phát hiện chai/ly nào trong ảnh
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 8 }}>
                  {lastResult.result.candidates.map((c, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between" }}>
                      <span>{c.label}</span>
                      <b>{(c.confidence * 100).toFixed(1)}%</b>
                    </div>
                  ))}

                  {lastResult.result.triggered.length > 0 ? (
                    lastResult.result.saved?.cameraId != null ? (
                      <span className="badge badge-warning" style={{ marginTop: 4 }}>
                        🚨 Xác nhận bị bỏ lại — đã tạo cảnh báo Warning
                      </span>
                    ) : (
                      <span className="badge badge-offline" style={{ marginTop: 4 }}>
                        Xác nhận bị bỏ lại, nhưng chưa gắn camera — không tạo cảnh báo
                      </span>
                    )
                  ) : (
                    <span className="badge badge-online" style={{ marginTop: 4 }}>
                      Mới thấy lần đầu — bấm lại (cùng ảnh) để xác nhận vật nằm yên
                    </span>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Cột phải: Feed phát hiện gần đây */}
        <div className="scroll-area" style={{ overflow: "auto", paddingRight: 4 }}>
          <h3 className="panel-title">🕒 Phát hiện gần đây</h3>

          {detectionsLoading && (
            <div style={{ fontSize: 12, color: "var(--text-faint)", marginTop: 8 }}>Đang tải...</div>
          )}

          {!detectionsLoading && detections.length === 0 && (
            <div className="empty-state">Chưa có phát hiện nào</div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 8 }}>
            {detections.map((d) => (
              <div key={d.id} className="card" style={{ padding: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <b style={{ fontSize: 13 }}>
                    {d.type === "crowd"
                      ? `👥 Đám đông (${d.personCount} người)`
                      : d.type === "litter"
                        ? "🗑️ Vứt rác"
                        : d.type === "weapon"
                          ? "🔫 Vũ khí"
                          : d.type === "lineCrossing"
                            ? `🚧 Qua line "${d.vcaLineName ?? ""}" (${d.direction ?? ""})`
                            : d.type === "zoneIntrusion"
                              ? `⬛ Xâm nhập vùng "${d.vcaZoneName ?? ""}"`
                              : `🕓 Lảng vảng "${d.vcaZoneName ?? ""}" (${d.dwellSeconds ?? "?"}s)`}
                  </b>
                  {d.triggeredAlert ? (
                    <span className="badge badge-critical">🚨</span>
                  ) : (
                    <span className="badge badge-online">✅</span>
                  )}
                </div>

                <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>
                  {d.cameraName ?? "Không rõ camera"} · {d.detectedAt}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BehaviorPanel;
