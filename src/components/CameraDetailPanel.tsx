import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import type { Camera } from "../types/camera";
import type { CameraAlert } from "../types/alert";
import type { RecordingSegment } from "../types/recording";
import EventTimeline from "./EventTimeline";

import EventFilter from "./EventFilter";

import useCameraEvents from "../hooks/useCameraEvents";
import useCameraRecordings from "../hooks/useCameraRecordings";
import useBookmarks from "../hooks/useBookmarks";
import HlsVideo from "./HlsVideo";
import RecordingList from "./RecordingList";
import { useAuth } from "../auth/AuthContext";
import { exportRecording } from "../api/client";
interface Props {
  camera: Camera | null;

  alerts: CameraAlert[];

  onClose: () => void;

  onEdit: (camera: Camera) => void;

  onDelete: (camera: Camera) => void;

  isFavorite: boolean;
  onToggleFavorite: () => void;
}

function CameraDetailPanel({
  camera,

  alerts,

  onClose,

  onEdit,

  onDelete,

  isFavorite,
  onToggleFavorite,
}: Props) {
  const { t } = useTranslation();
  const { hasPermission } = useAuth();
  const [selectedRecording, setSelectedRecording] = useState<RecordingSegment | null>(null);
  const { recordings, loading: recordingsLoading } = useCameraRecordings(camera?.id ?? null);
  const { bookmarks, add: addBookmark, remove: removeBookmark } = useBookmarks(camera?.id ?? null);
  const [bookmarkLabel, setBookmarkLabel] = useState("");
  const [savingBookmark, setSavingBookmark] = useState(false);

  // Đổi camera thì bỏ chọn bản ghi cũ, quay về xem trực tiếp.
  useEffect(() => {
    setSelectedRecording(null);
  }, [camera?.id]);

  const { events, filter, setFilter } = useCameraEvents(camera?.id ?? null, alerts.length);

  const handleExportRecording = async (segment: RecordingSegment) => {
    if (!camera) return;

    const { blob, truncatedToSeconds } = await exportRecording(
      camera.id,
      segment.start,
      segment.durationSeconds,
    );
    const url = URL.createObjectURL(blob);
    const startLabel = segment.start.replace(/[:.]/g, "-");
    const link = document.createElement("a");
    link.href = url;
    link.download = `${camera.name}_${startLabel}.mp4`;
    link.click();
    URL.revokeObjectURL(url);

    if (truncatedToSeconds !== null) {
      const minutes = Math.round(truncatedToSeconds / 60);
      return `Đoạn ghi hình dài hơn ${minutes} phút — chỉ xuất ${minutes} phút đầu tiên.`;
    }
  };

  const handleAddBookmark = async () => {
    if (!bookmarkLabel.trim()) return;

    // Đánh dấu tại đúng thời điểm đang xem: nếu đang xem lại thì lấy mốc
    // thời gian của bản ghi + video hiện đang tua tới đâu; xem trực tiếp thì
    // lấy thời điểm hiện tại.
    setSavingBookmark(true);
    try {
      const timestamp = selectedRecording ? selectedRecording.start : new Date().toISOString();
      await addBookmark(bookmarkLabel.trim(), timestamp);
      setBookmarkLabel("");
    } catch (err) {
      console.error("Không tạo được bookmark:", err);
    } finally {
      setSavingBookmark(false);
    }
  };

  if (!camera) {
    return null;
  }

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        boxSizing: "border-box",
        padding: 18,
        overflow: "auto",
      }}
      className="scroll-area"
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 8,
        }}
      >
        <div>
          <h2 style={{ marginBottom: 6, display: "flex", alignItems: "center", gap: 8 }}>
            <button
              className="btn btn-icon btn-ghost"
              style={{ padding: 0, fontSize: 20, lineHeight: 1 }}
              title={isFavorite ? t("sidebar.removeFromFavorite") : t("sidebar.addToFavorite")}
              onClick={onToggleFavorite}
            >
              {isFavorite ? "⭐" : "☆"}
            </button>
            {camera.name}
          </h2>
          <span
            className={
              "badge " +
              (camera.status === "online" ? "badge-online" : "badge-offline")
            }
          >
            <span className="badge-dot" />
            {camera.status === "online" ? t("common.online") : t("common.offline")}
          </span>
        </div>

        <div style={{ display: "flex", gap: 6 }}>
          {hasPermission("ManageCameras") && (
            <>
              <button className="btn btn-sm" onClick={() => onEdit(camera)}>
                ✏️ {t("common.edit")}
              </button>
              <button className="btn btn-sm btn-danger" onClick={() => onDelete(camera)}>
                🗑️ {t("common.delete")}
              </button>
            </>
          )}
          <button className="btn btn-icon btn-ghost" onClick={onClose} title={t("common.close")}>
            ✕
          </button>
        </div>
      </div>

      <p
        style={{
          marginTop: 12,
          fontSize: 13,
          color: "var(--text-muted)",
        }}
      >
        {camera.address}
      </p>

      <div
        style={{
          display: "flex",
          gap: 16,
          marginTop: 8,
          fontSize: 12,
          color: "var(--text-muted)",
        }}
      >
        <span>
          {t("cameraDetail.signal")}: <b style={{ color: "var(--text)" }}>{camera.signal}%</b>
        </span>
        <span>{t("cameraDetail.lastSeen")}: {camera.lastSeen}</span>
      </div>

      <hr />

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <h3 style={{ margin: 0 }}>
          {selectedRecording ? t("cameraDetail.playback") : t("cameraDetail.live")}
        </h3>

        {selectedRecording && (
          <button className="btn btn-sm" onClick={() => setSelectedRecording(null)}>
            {t("cameraDetail.backToLive")}
          </button>
        )}
      </div>

      <HlsVideo
        src={selectedRecording?.playbackUrl ?? camera.streamUrl}
        controls
        muted
        autoPlay
        style={{
          width: "100%",
          marginTop: 8,
          borderRadius: "var(--radius-md)",
          background: "#000",
        }}
      />

      <hr />

      <h3 style={{ marginBottom: 10 }}>{t("cameraDetail.recordings")}</h3>

      <RecordingList
        recordings={recordings}
        loading={recordingsLoading}
        selectedUrl={selectedRecording?.playbackUrl ?? null}
        onSelect={setSelectedRecording}
        canExport={hasPermission("ExportRecording")}
        onExport={handleExportRecording}
      />

      <hr />

      <h3 style={{ marginBottom: 10 }}>{t("cameraDetail.bookmarks")}</h3>

      <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
        <input
          className="text-input"
          placeholder={
            selectedRecording
              ? t("cameraDetail.bookmarkPlaceholderPlayback")
              : t("cameraDetail.bookmarkPlaceholderLive")
          }
          value={bookmarkLabel}
          onChange={(e) => setBookmarkLabel(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAddBookmark()}
        />
        <button
          className="btn btn-primary btn-sm"
          onClick={handleAddBookmark}
          disabled={savingBookmark || !bookmarkLabel.trim()}
        >
          {t("cameraDetail.addBookmark")}
        </button>
      </div>

      {bookmarks.length === 0 ? (
        <div className="empty-state">{t("cameraDetail.noBookmarks")}</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 4 }}>
          {bookmarks.map((b) => (
            <div
              key={b.id}
              className="card"
              style={{
                padding: "8px 10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 8,
              }}
            >
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 12.5, fontWeight: 600 }}>{b.label}</div>
                <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
                  {new Date(b.timestamp).toLocaleString("vi-VN")} · {b.createdByUsername}
                </div>
              </div>
              <button
                className="btn btn-icon btn-ghost"
                title={t("common.delete")}
                onClick={() => removeBookmark(b.id)}
              >
                🗑️
              </button>
            </div>
          ))}
        </div>
      )}

      <hr />

      <h3 style={{ marginBottom: 10 }}>{t("cameraDetail.alertHistory")}</h3>

      <EventFilter value={filter} onChange={setFilter} />

      <EventTimeline events={events} />
    </div>
  );
}

export default CameraDetailPanel;
