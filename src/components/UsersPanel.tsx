import { useEffect, useRef, useState } from "react";
import {
  getRoles,
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  exportBackup,
  restoreBackup,
  getScheduledBackups,
  runScheduledBackupNow,
  getScheduledRestartStatus,
  triggerScheduledRestartNow,
} from "../api/client";
import type { ManagedUser, Role } from "../types/user";
import type { Zone } from "../types/zone";
import type { ScheduledBackupFile, ScheduledRestartStatus } from "../api/client";

interface Props {
  onClose: () => void;
  zones: Zone[];
}

function UsersPanel({ onClose, zones }: Props) {
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = () => {
    setLoading(true);
    return Promise.all([getUsers(), getRoles()])
      .then(([u, r]) => {
        setUsers(u);
        setRoles(r);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Không tải được dữ liệu"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    refresh();
  }, []);

  // --- Backup / Restore cấu hình hệ thống ---
  const [exportingBackup, setExportingBackup] = useState(false);
  const [restoringBackup, setRestoringBackup] = useState(false);
  const [backupError, setBackupError] = useState<string | null>(null);
  const [backupMessage, setBackupMessage] = useState<string | null>(null);
  const restoreFileInputRef = useRef<HTMLInputElement>(null);

  const handleExportBackup = async () => {
    setExportingBackup(true);
    setBackupError(null);
    setBackupMessage(null);

    try {
      const blob = await exportBackup();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `vms-backup_${new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-")}.json`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setBackupError(err instanceof Error ? err.message : "Xuất backup thất bại");
    } finally {
      setExportingBackup(false);
    }
  };

  const handleRestoreFileSelected = async (file: File | null) => {
    if (!file) return;

    const confirmed = window.confirm(
      "Khôi phục sẽ XOÁ TOÀN BỘ camera, zone, danh sách đen/trắng ANPR và người " +
        "đã đăng ký hiện tại, thay bằng nội dung trong file backup. Cảnh báo/lịch sử " +
        "gắn với camera hoặc zone bị xoá cũng mất theo. Hành động này không thể hoàn " +
        "tác. Tiếp tục?",
    );
    if (!confirmed) {
      if (restoreFileInputRef.current) restoreFileInputRef.current.value = "";
      return;
    }

    setRestoringBackup(true);
    setBackupError(null);
    setBackupMessage(null);

    try {
      const text = await file.text();
      await restoreBackup(text);
      setBackupMessage("Khôi phục thành công — đang tải lại trang...");
      setTimeout(() => window.location.reload(), 1500);
    } catch (err) {
      setBackupError(err instanceof Error ? err.message : "Khôi phục thất bại");
    } finally {
      setRestoringBackup(false);
      if (restoreFileInputRef.current) restoreFileInputRef.current.value = "";
    }
  };

  // --- Sao lưu tự động theo lịch (chạy nền, hiện danh sách để kiểm chứng) ---
  const [scheduledBackups, setScheduledBackups] = useState<ScheduledBackupFile[]>([]);
  const [loadingScheduled, setLoadingScheduled] = useState(true);
  const [runningNow, setRunningNow] = useState(false);
  const [scheduledError, setScheduledError] = useState<string | null>(null);

  const refreshScheduled = () => {
    setLoadingScheduled(true);
    return getScheduledBackups()
      .then(setScheduledBackups)
      .catch((err) => setScheduledError(err instanceof Error ? err.message : "Không tải được danh sách"))
      .finally(() => setLoadingScheduled(false));
  };

  useEffect(() => {
    refreshScheduled();
  }, []);

  const handleRunScheduledNow = async () => {
    setRunningNow(true);
    setScheduledError(null);
    try {
      await runScheduledBackupNow();
      await refreshScheduled();
    } catch (err) {
      setScheduledError(err instanceof Error ? err.message : "Chạy sao lưu thất bại");
    } finally {
      setRunningNow(false);
    }
  };

  // --- A11/H18: lập lịch tự khởi động lại hệ thống định kỳ ---
  const [restartStatus, setRestartStatus] = useState<ScheduledRestartStatus | null>(null);
  const [restartError, setRestartError] = useState<string | null>(null);
  const [restartMessage, setRestartMessage] = useState<string | null>(null);
  const [triggeringRestart, setTriggeringRestart] = useState(false);

  useEffect(() => {
    getScheduledRestartStatus()
      .then(setRestartStatus)
      .catch((err) => setRestartError(err instanceof Error ? err.message : "Không tải được trạng thái"));
  }, []);

  const dayLabels: Record<string, string> = {
    Sunday: "CN",
    Monday: "T2",
    Tuesday: "T3",
    Wednesday: "T4",
    Thursday: "T5",
    Friday: "T6",
    Saturday: "T7",
  };

  const handleTriggerRestartNow = async () => {
    if (!confirm("Hệ thống sẽ tự khởi động lại sau ~1 giây — mọi kết nối đang xem trực tiếp sẽ tạm gián đoạn vài giây. Tiếp tục?"))
      return;

    setTriggeringRestart(true);
    setRestartError(null);
    setRestartMessage(null);
    try {
      const res = await triggerScheduledRestartNow();
      setRestartMessage(res.message);
    } catch (err) {
      setRestartError(err instanceof Error ? err.message : "Khởi động lại thất bại");
    } finally {
      setTriggeringRestart(false);
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // --- Form tạo user mới ---
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRoleId, setNewRoleId] = useState<number | null>(null);
  const [newZoneIds, setNewZoneIds] = useState<number[]>([]);
  // H21 — Ldap: mật khẩu do LDAP xác thực, không nhập ở đây.
  const [newAuthProvider, setNewAuthProvider] = useState<"local" | "ldap">("local");
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const toggleNewZone = (zoneId: number) => {
    setNewZoneIds((prev) =>
      prev.includes(zoneId) ? prev.filter((id) => id !== zoneId) : [...prev, zoneId],
    );
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const needsPassword = newAuthProvider === "local";
    if (!newUsername.trim() || (needsPassword && !newPassword.trim()) || newRoleId === null) {
      setCreateError(
        needsPassword
          ? "Cần nhập tên đăng nhập, mật khẩu và chọn role"
          : "Cần nhập tên đăng nhập và chọn role",
      );
      return;
    }

    setCreating(true);
    setCreateError(null);

    try {
      await createUser({
        username: newUsername.trim(),
        password: needsPassword ? newPassword : "",
        roleId: newRoleId,
        zoneIds: newZoneIds,
        authProvider: newAuthProvider,
      });
      setNewUsername("");
      setNewPassword("");
      setNewRoleId(null);
      setNewZoneIds([]);
      setNewAuthProvider("local");
      await refresh();
    } catch (err) {
      setCreateError(err instanceof Error ? err.message : "Tạo user thất bại");
    } finally {
      setCreating(false);
    }
  };

  // --- Sửa role / zone của user có sẵn ---
  const [savingUserId, setSavingUserId] = useState<number | null>(null);

  const handleChangeRole = async (userId: number, roleId: number) => {
    setSavingUserId(userId);
    try {
      await updateUser(userId, { roleId });
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Đổi role thất bại");
    } finally {
      setSavingUserId(null);
    }
  };

  const handleToggleUserZone = async (user: ManagedUser, zoneId: number) => {
    const zoneIds = user.zoneIds.includes(zoneId)
      ? user.zoneIds.filter((id) => id !== zoneId)
      : [...user.zoneIds, zoneId];

    setSavingUserId(user.id);
    try {
      await updateUser(user.id, { zoneIds });
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Đổi quyền camera thất bại");
    } finally {
      setSavingUserId(null);
    }
  };

  // --- A12: khung giờ được phép dùng quyền, theo từng user ---
  const minutesToHHmm = (m: number | null) => {
    if (m === null) return "";
    const h = Math.floor(m / 60)
      .toString()
      .padStart(2, "0");
    const mm = (m % 60).toString().padStart(2, "0");
    return `${h}:${mm}`;
  };
  const hhmmToMinutes = (v: string): number | null => {
    if (!v) return null;
    const [h, m] = v.split(":").map(Number);
    return h * 60 + m;
  };

  const [timeWindowDrafts, setTimeWindowDrafts] = useState<Record<number, { start: string; end: string }>>({});

  const draftFor = (u: ManagedUser) =>
    timeWindowDrafts[u.id] ?? {
      start: minutesToHHmm(u.timeWindowStartMinutes),
      end: minutesToHHmm(u.timeWindowEndMinutes),
    };

  const setDraft = (userId: number, patch: Partial<{ start: string; end: string }>) => {
    setTimeWindowDrafts((prev) => ({ ...prev, [userId]: { ...draftFor(users.find((u) => u.id === userId)!), ...prev[userId], ...patch } }));
  };

  const handleSaveTimeWindow = async (u: ManagedUser) => {
    const draft = draftFor(u);
    setSavingUserId(u.id);
    try {
      await updateUser(u.id, {
        updateTimeWindow: true,
        timeWindowStartMinutes: hhmmToMinutes(draft.start),
        timeWindowEndMinutes: hhmmToMinutes(draft.end),
      });
      setTimeWindowDrafts((prev) => {
        const next = { ...prev };
        delete next[u.id];
        return next;
      });
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Đặt khung giờ thất bại");
    } finally {
      setSavingUserId(null);
    }
  };

  const handleDelete = async (userId: number) => {
    setSavingUserId(userId);
    try {
      await deleteUser(userId);
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Xoá user thất bại");
    } finally {
      setSavingUserId(null);
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
        <h2 style={{ margin: 0 }}>👥 Quản lý người dùng</h2>
        <button className="btn" onClick={onClose}>
          ✕ Đóng
        </button>
      </div>

      <div
        style={{
          flex: 1,
          minHeight: 0,
          display: "grid",
          gridTemplateColumns: "340px minmax(0, 1fr)",
          gap: 16,
          padding: 20,
          overflow: "hidden",
        }}
      >
        {/* Cột trái: tạo user mới */}
        <div className="scroll-area" style={{ overflow: "auto", paddingRight: 4 }}>
          <h3 className="panel-title">➕ Thêm người dùng</h3>

          <form onSubmit={handleCreate} className="panel-block" style={{ padding: 14 }}>
            <div style={{ marginBottom: 10 }}>
              <span className="field-label">Tên đăng nhập</span>
              <input
                className="text-input"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                placeholder="vd. bao-ve-toa-a"
              />
            </div>

            <div style={{ marginBottom: 10 }}>
              <span className="field-label">Xác thực</span>
              <div style={{ display: "flex", gap: 12, marginTop: 4 }}>
                <label style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13 }}>
                  <input
                    type="radio"
                    checked={newAuthProvider === "local"}
                    onChange={() => setNewAuthProvider("local")}
                  />
                  Mật khẩu cục bộ
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13 }}>
                  <input
                    type="radio"
                    checked={newAuthProvider === "ldap"}
                    onChange={() => setNewAuthProvider("ldap")}
                  />
                  AD/LDAP
                </label>
              </div>
            </div>

            {newAuthProvider === "local" ? (
              <div style={{ marginBottom: 10 }}>
                <span className="field-label">Mật khẩu</span>
                <input
                  type="password"
                  className="text-input"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
            ) : (
              <p style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 10 }}>
                Mật khẩu do máy chủ AD/LDAP xác thực khi đăng nhập — không nhập ở đây. Tên
                đăng nhập phải khớp đúng tài khoản LDAP.
              </p>
            )}

            <div style={{ marginBottom: 10 }}>
              <span className="field-label">Role (quyền theo chức năng)</span>
              <select
                className="select-input"
                value={newRoleId ?? ""}
                onChange={(e) => setNewRoleId(e.target.value ? Number(e.target.value) : null)}
              >
                <option value="">-- Chọn role --</option>
                {roles.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
              {newRoleId !== null && (
                <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>
                  {roles.find((r) => r.id === newRoleId)?.permissions.join(", ")}
                </p>
              )}
            </div>

            <div style={{ marginBottom: 12 }}>
              <span className="field-label">
                Giới hạn camera theo zone (bỏ trống = thấy tất cả camera)
              </span>
              <div style={{ display: "flex", flexDirection: "column", gap: 4, marginTop: 4 }}>
                {zones.map((zone) => (
                  <label key={zone.id} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13 }}>
                    <input
                      type="checkbox"
                      checked={newZoneIds.includes(zone.id)}
                      onChange={() => toggleNewZone(zone.id)}
                    />
                    {zone.name}
                  </label>
                ))}
              </div>
            </div>

            {createError && (
              <p style={{ color: "var(--danger)", fontSize: 12, marginBottom: 10 }}>{createError}</p>
            )}

            <button type="submit" className="btn btn-primary btn-block" disabled={creating}>
              {creating ? "Đang tạo..." : "Tạo người dùng"}
            </button>
          </form>

          <h3 className="panel-title" style={{ marginTop: 20 }}>
            💾 Sao lưu &amp; Khôi phục cấu hình
          </h3>

          <div className="panel-block" style={{ padding: 14 }}>
            <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 10 }}>
              Gồm camera, zone, danh sách đen/trắng ANPR, người đã đăng ký khuôn mặt và cấu
              hình AI. Không gồm tài khoản người dùng và lịch sử alert/detection.
            </p>

            <button
              className="btn btn-block"
              onClick={handleExportBackup}
              disabled={exportingBackup}
              style={{ marginBottom: 8 }}
            >
              {exportingBackup ? "Đang xuất..." : "📥 Xuất backup (.json)"}
            </button>

            <input
              ref={restoreFileInputRef}
              type="file"
              accept="application/json"
              onChange={(e) => handleRestoreFileSelected(e.target.files?.[0] ?? null)}
              disabled={restoringBackup}
              style={{ marginBottom: 4 }}
            />
            <p style={{ fontSize: 11, color: "var(--danger)" }}>
              ⚠️ Chọn file sẽ khôi phục ngay (có xác nhận) — thay thế toàn bộ dữ liệu hiện tại.
            </p>

            {backupError && (
              <p style={{ color: "var(--danger)", fontSize: 12, marginTop: 4 }}>{backupError}</p>
            )}
            {backupMessage && (
              <p style={{ color: "var(--success)", fontSize: 12, marginTop: 4 }}>{backupMessage}</p>
            )}
          </div>

          <h3 className="panel-title" style={{ marginTop: 20 }}>
            🕒 Sao lưu tự động theo lịch
          </h3>

          <div className="panel-block" style={{ padding: 14 }}>
            <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 10 }}>
              Hệ thống tự ghi 1 bản sao lưu cấu hình ra đĩa server theo chu kỳ cấu hình
              (mặc định 24h), giữ lại 14 bản gần nhất. Không cần thao tác gì thêm.
            </p>

            <button
              className="btn btn-block"
              onClick={handleRunScheduledNow}
              disabled={runningNow}
              style={{ marginBottom: 10 }}
            >
              {runningNow ? "Đang chạy..." : "▶ Chạy sao lưu ngay (không cần đợi lịch)"}
            </button>

            {scheduledError && (
              <p style={{ color: "var(--danger)", fontSize: 12, marginBottom: 8 }}>{scheduledError}</p>
            )}

            {loadingScheduled ? (
              <div style={{ fontSize: 12, color: "var(--text-faint)" }}>Đang tải...</div>
            ) : scheduledBackups.length === 0 ? (
              <div className="empty-state">Chưa có bản sao lưu tự động nào</div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {scheduledBackups.map((f) => (
                  <div
                    key={f.fileName}
                    className="card"
                    style={{
                      padding: "6px 10px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      fontSize: 12,
                    }}
                  >
                    <span>{new Date(f.createdAt).toLocaleString("vi-VN")}</span>
                    <span style={{ color: "var(--text-muted)" }}>{formatBytes(f.sizeBytes)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <h3 className="panel-title" style={{ marginTop: 20 }}>
            🔁 Lập lịch tự khởi động lại hệ thống
          </h3>

          <div className="panel-block" style={{ padding: 14 }}>
            {restartStatus === null ? (
              <div style={{ fontSize: 12, color: "var(--text-faint)" }}>Đang tải...</div>
            ) : (
              <>
                <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 10 }}>
                  {restartStatus.enabled ? (
                    <>
                      Đang bật — tự khởi động lại lúc <b>{restartStatus.timeOfDay}</b>{" "}
                      {restartStatus.daysOfWeek.length === 0
                        ? "mỗi ngày"
                        : `vào ${restartStatus.daysOfWeek.map((d) => dayLabels[d] ?? d).join(", ")}`}
                      . Cấu hình trong <code>appsettings.json</code> (mục{" "}
                      <code>ScheduledRestart</code>).
                    </>
                  ) : (
                    <>
                      Đang tắt — bật bằng cách đặt <code>ScheduledRestart.Enabled = true</code> trong{" "}
                      <code>appsettings.json</code>.
                    </>
                  )}
                </p>

                {restartStatus.lastTriggeredAtLocal && (
                  <p style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 10 }}>
                    Lần gần nhất: {new Date(restartStatus.lastTriggeredAtLocal).toLocaleString("vi-VN")}
                  </p>
                )}

                <button
                  className="btn btn-block btn-danger"
                  onClick={handleTriggerRestartNow}
                  disabled={triggeringRestart}
                >
                  {triggeringRestart ? "Đang khởi động lại..." : "⚠ Khởi động lại ngay (test/thủ công)"}
                </button>

                {restartError && (
                  <p style={{ color: "var(--danger)", fontSize: 12, marginTop: 8 }}>{restartError}</p>
                )}
                {restartMessage && (
                  <p style={{ color: "var(--success)", fontSize: 12, marginTop: 8 }}>{restartMessage}</p>
                )}
              </>
            )}
          </div>
        </div>

        {/* Cột phải: danh sách user */}
        <div className="scroll-area" style={{ overflow: "auto", paddingRight: 4 }}>
          <h3 className="panel-title">📋 Danh sách người dùng</h3>

          {error && <p style={{ color: "var(--danger)", fontSize: 12, marginBottom: 8 }}>{error}</p>}
          {loading && <div style={{ fontSize: 12, color: "var(--text-faint)" }}>Đang tải...</div>}

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {users.map((u) => (
              <div key={u.id} className="card" style={{ padding: 12, opacity: savingUserId === u.id ? 0.6 : 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                  <b style={{ fontSize: 14 }}>
                    {u.username}
                    {u.authProvider === "ldap" && (
                      <span
                        className="badge badge-info"
                        style={{ marginLeft: 6, fontSize: 10, verticalAlign: "middle" }}
                        title="Đăng nhập qua AD/LDAP"
                      >
                        LDAP
                      </span>
                    )}
                  </b>

                  <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                    <select
                      className="select-input"
                      style={{ fontSize: 12, padding: "2px 6px" }}
                      value={u.roleId}
                      disabled={savingUserId === u.id}
                      onChange={(e) => handleChangeRole(u.id, Number(e.target.value))}
                    >
                      {roles.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.name}
                        </option>
                      ))}
                    </select>

                    <button
                      className="btn btn-icon btn-ghost"
                      title="Xoá"
                      disabled={savingUserId === u.id}
                      onClick={() => handleDelete(u.id)}
                    >
                      🗑️
                    </button>
                  </div>
                </div>

                <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 6, marginBottom: 4 }}>
                  Camera được xem — bỏ trống = tất cả:
                </div>

                <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                  {zones.map((zone) => (
                    <label
                      key={zone.id}
                      style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12 }}
                    >
                      <input
                        type="checkbox"
                        checked={u.zoneIds.includes(zone.id)}
                        disabled={savingUserId === u.id}
                        onChange={() => handleToggleUserZone(u, zone.id)}
                      />
                      {zone.name}
                    </label>
                  ))}
                </div>

                <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 8, marginBottom: 4 }}>
                  Khung giờ được dùng quyền — bỏ trống cả 2 = không giới hạn:
                </div>
                <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                  <input
                    type="time"
                    className="text-input"
                    style={{ fontSize: 12, padding: "2px 6px", width: 100 }}
                    value={draftFor(u).start}
                    disabled={savingUserId === u.id}
                    onChange={(e) => setDraft(u.id, { start: e.target.value })}
                  />
                  <span style={{ fontSize: 12 }}>→</span>
                  <input
                    type="time"
                    className="text-input"
                    style={{ fontSize: 12, padding: "2px 6px", width: 100 }}
                    value={draftFor(u).end}
                    disabled={savingUserId === u.id}
                    onChange={(e) => setDraft(u.id, { end: e.target.value })}
                  />
                  <button
                    className="btn btn-sm"
                    disabled={savingUserId === u.id}
                    onClick={() => handleSaveTimeWindow(u)}
                  >
                    Lưu
                  </button>
                </div>
              </div>
            ))}

            {!loading && users.length === 0 && (
              <div className="empty-state">Chưa có người dùng nào</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UsersPanel;
