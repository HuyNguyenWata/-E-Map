import { useState } from "react";
import useBehaviorSettings from "../hooks/useBehaviorSettings";
import useBehaviorDetections from "../hooks/useBehaviorDetections";
import { detectCrowd, detectWeapon } from "../api/behaviorService";
import type { CrowdDetectResult, WeaponDetectResult } from "../api/behaviorService";
import { useAuth } from "../auth/AuthContext";

interface Props {
  onClose: () => void;
}

type LastResult =
  | { kind: "crowd"; result: CrowdDetectResult }
  | { kind: "weapon"; result: WeaponDetectResult };

function BehaviorPanel({ onClose }: Props) {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

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
  const [testFile, setTestFile] = useState<File | null>(null);
  const [testPreviewUrl, setTestPreviewUrl] = useState<string | null>(null);
  const [detecting, setDetecting] = useState<"crowd" | "weapon" | null>(null);
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
      const result = await detectCrowd(testFile);
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
      const result = await detectWeapon(testFile);
      setLastResult({ kind: "weapon", result });
      refreshDetections();
    } catch (err) {
      setDetectError(err instanceof Error ? err.message : "Phát hiện vũ khí thất bại");
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
        <h2 style={{ margin: 0 }}>🏃 AI Hành vi — Đám đông &amp; Vũ khí</h2>
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

          <div className="panel-block" style={{ padding: 14 }}>
            <p style={{ fontSize: 12, color: "var(--text-muted)" }}>
              🔫 Phát hiện vũ khí không cần ngưỡng — chỉ cần phát hiện 1 khẩu súng
              trong khung hình là tạo cảnh báo Critical ngay lập tức.
            </p>
          </div>
        </div>

        {/* Cột giữa: Upload ảnh test */}
        <div className="scroll-area" style={{ overflow: "auto", paddingRight: 4 }}>
          <h3 className="panel-title">📷 Thử phát hiện từ ảnh</h3>

          <div className="panel-block" style={{ padding: 14, marginBottom: 14 }}>
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
                <span className="badge badge-critical" style={{ marginTop: 8 }}>
                  🚨 Vượt ngưỡng — đã tạo cảnh báo
                </span>
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
                  <span className="badge badge-critical" style={{ marginTop: 4 }}>
                    🚨 Đã tạo cảnh báo Critical
                  </span>
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
                    {d.type === "crowd" ? `👥 Đám đông (${d.personCount} người)` : "🔫 Vũ khí"}
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
