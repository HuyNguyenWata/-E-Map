import { useState } from "react";
import usePeople from "../hooks/usePeople";
import useFaceDetections from "../hooks/useFaceDetections";
import useAttendanceSummary from "../hooks/useAttendanceSummary";
import { enrollPerson, detectFacesInImage } from "../api/faceService";
import type { FaceDetectResult } from "../api/faceService";
import { useAuth } from "../auth/AuthContext";

interface Props {
  onClose: () => void;
}

function FacePanel({ onClose }: Props) {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const { people, loading: peopleLoading, addPerson, removePerson } = usePeople();
  const { detections, loading: detectionsLoading, refresh: refreshDetections } =
    useFaceDetections(undefined, 30);
  const { summary: attendance, loading: attendanceLoading, refresh: refreshAttendance } =
    useAttendanceSummary(7);

  // --- Đăng ký người mới ---
  const [enrollName, setEnrollName] = useState("");
  const [enrollDescription, setEnrollDescription] = useState("");
  const [enrollFile, setEnrollFile] = useState<File | null>(null);
  const [enrolling, setEnrolling] = useState(false);
  const [enrollError, setEnrollError] = useState<string | null>(null);

  const handleEnroll = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!enrollName.trim() || !enrollFile) {
      setEnrollError("Cần nhập tên và chọn ảnh");
      return;
    }

    setEnrolling(true);
    setEnrollError(null);

    try {
      const result = await enrollPerson(enrollName, enrollDescription, enrollFile);
      addPerson(result.person);
      setEnrollName("");
      setEnrollDescription("");
      setEnrollFile(null);
    } catch (err) {
      setEnrollError(err instanceof Error ? err.message : "Đăng ký thất bại");
    } finally {
      setEnrolling(false);
    }
  };

  // --- Nhận diện từ ảnh test ---
  const [testFile, setTestFile] = useState<File | null>(null);
  const [testPreviewUrl, setTestPreviewUrl] = useState<string | null>(null);
  const [detecting, setDetecting] = useState(false);
  const [detectError, setDetectError] = useState<string | null>(null);
  const [lastResults, setLastResults] = useState<FaceDetectResult[] | null>(null);

  const handleTestFileChange = (file: File | null) => {
    setTestFile(file);
    setLastResults(null);
    setDetectError(null);
    if (testPreviewUrl) URL.revokeObjectURL(testPreviewUrl);
    setTestPreviewUrl(file ? URL.createObjectURL(file) : null);
  };

  const handleDetect = async () => {
    if (!testFile) return;

    setDetecting(true);
    setDetectError(null);

    try {
      const results = await detectFacesInImage(testFile);
      setLastResults(results);
      refreshDetections();
      refreshAttendance();
    } catch (err) {
      setDetectError(err instanceof Error ? err.message : "Nhận diện thất bại");
    } finally {
      setDetecting(false);
    }
  };

  const maxAttendanceTotal = Math.max(1, ...attendance.map((a) => a.total));

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
        <h2 style={{ margin: 0 }}>🧑 AI Khuôn mặt — Điểm danh</h2>
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
        {/* Cột trái: Danh sách người đã đăng ký */}
        <div className="scroll-area" style={{ overflow: "auto", paddingRight: 4 }}>
          <h3 className="panel-title">👥 Người đã đăng ký</h3>

          {isAdmin && (
            <form
              onSubmit={handleEnroll}
              className="panel-block"
              style={{ padding: 12, marginBottom: 12 }}
            >
              <input
                className="text-input"
                placeholder="Họ tên"
                value={enrollName}
                onChange={(e) => setEnrollName(e.target.value)}
                style={{ marginBottom: 8 }}
              />

              <input
                className="text-input"
                placeholder="Mô tả (phòng ban, chức vụ...)"
                value={enrollDescription}
                onChange={(e) => setEnrollDescription(e.target.value)}
                style={{ marginBottom: 8 }}
              />

              <input
                type="file"
                accept="image/*"
                onChange={(e) => setEnrollFile(e.target.files?.[0] ?? null)}
                style={{ marginBottom: 8 }}
              />

              {enrollError && (
                <p style={{ color: "var(--danger)", fontSize: 12, marginBottom: 8 }}>{enrollError}</p>
              )}

              <button type="submit" className="btn btn-primary btn-block" disabled={enrolling}>
                {enrolling ? "Đang đăng ký..." : "+ Đăng ký người mới"}
              </button>
            </form>
          )}

          {peopleLoading && (
            <div style={{ fontSize: 12, color: "var(--text-faint)" }}>Đang tải...</div>
          )}

          {!peopleLoading && people.length === 0 && (
            <div className="empty-state">Chưa có người nào được đăng ký</div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {people.map((person) => (
              <div
                key={person.id}
                className="card"
                style={{ padding: 10, display: "flex", alignItems: "center", gap: 10 }}
              >
                {person.photoBase64 ? (
                  <img
                    src={person.photoBase64}
                    alt={person.fullName}
                    style={{ width: 40, height: 40, borderRadius: "50%", objectFit: "cover" }}
                  />
                ) : (
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      background: "var(--neutral-bg)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    👤
                  </div>
                )}

                <div style={{ flex: 1, minWidth: 0 }}>
                  <b style={{ fontSize: 13 }}>{person.fullName}</b>
                  {person.description && (
                    <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
                      {person.description}
                    </div>
                  )}
                </div>

                {isAdmin && (
                  <button
                    className="btn btn-icon btn-ghost"
                    title="Xoá"
                    onClick={() => removePerson(person.id)}
                  >
                    🗑️
                  </button>
                )}
              </div>
            ))}
          </div>

          <h3 className="panel-title" style={{ marginTop: 20 }}>
            📊 Điểm danh 7 ngày qua
          </h3>

          {attendanceLoading && (
            <div style={{ fontSize: 12, color: "var(--text-faint)" }}>Đang tải...</div>
          )}

          {!attendanceLoading && attendance.length === 0 && (
            <div className="empty-state">Chưa có dữ liệu điểm danh</div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {attendance.map((a) => (
              <div key={a.personId} style={{ fontSize: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                  <span>{a.personName}</span>
                  <b>{a.total}</b>
                </div>
                <div style={{ height: 6, borderRadius: 3, background: "var(--border-soft)" }}>
                  <div
                    style={{
                      width: `${(a.total / maxAttendanceTotal) * 100}%`,
                      height: "100%",
                      borderRadius: 3,
                      background: "var(--primary)",
                    }}
                  />
                </div>
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

            <button
              className="btn btn-primary btn-block"
              onClick={handleDetect}
              disabled={!testFile || detecting}
            >
              {detecting ? "Đang nhận diện..." : "Nhận diện khuôn mặt"}
            </button>

            {detectError && (
              <p style={{ color: "var(--danger)", fontSize: 12, marginTop: 8 }}>{detectError}</p>
            )}
          </div>

          {lastResults && (
            <div>
              <h4 style={{ marginBottom: 8 }}>Kết quả ({lastResults.length})</h4>

              {lastResults.length === 0 && (
                <div className="empty-state">Không phát hiện được khuôn mặt nào trong ảnh</div>
              )}

              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {lastResults.map((r, i) => (
                  <div key={i} className="card" style={{ padding: 10 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <b style={{ fontSize: 14 }}>{r.saved.personName ?? "Người lạ"}</b>
                      {r.saved.personName ? (
                        <span className="badge badge-online">✅ Đã xác định</span>
                      ) : (
                        <span className="badge badge-offline">❓ Không xác định</span>
                      )}
                    </div>
                    <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>
                      {r.saved.personName
                        ? `Độ tương đồng: ${(r.saved.similarity * 100).toFixed(1)}%`
                        : `Độ tin cậy phát hiện: ${(r.detScore * 100).toFixed(1)}%`}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Cột phải: Feed điểm danh gần đây */}
        <div className="scroll-area" style={{ overflow: "auto", paddingRight: 4 }}>
          <h3 className="panel-title">🕒 Điểm danh gần đây</h3>

          {detectionsLoading && (
            <div style={{ fontSize: 12, color: "var(--text-faint)", marginTop: 8 }}>Đang tải...</div>
          )}

          {!detectionsLoading && detections.length === 0 && (
            <div className="empty-state">Chưa có lượt điểm danh nào</div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 8 }}>
            {detections.map((d) => (
              <div key={d.id} className="card" style={{ padding: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <b style={{ fontSize: 13 }}>{d.personName ?? "Người lạ"}</b>
                  {d.personName ? (
                    <span className="badge badge-online">✅</span>
                  ) : (
                    <span className="badge badge-offline">❓</span>
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

export default FacePanel;
