import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { RecordingSegment } from "../types/recording";

interface Props {
  recordings: RecordingSegment[];
  loading: boolean;
  selectedUrl: string | null;
  onSelect: (segment: RecordingSegment) => void;
  canExport: boolean;
  // Trả về 1 chuỗi thông báo (vd. bị cắt ngắn) để hiển thị dạng info sau khi
  // xuất thành công; không trả gì thì không hiện gì thêm.
  onExport: (segment: RecordingSegment) => Promise<string | void>;
}

function formatStart(iso: string, locale: string) {
  const date = new Date(iso);
  return date.toLocaleString(locale, {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function RecordingList({ recordings, loading, selectedUrl, onSelect, canExport, onExport }: Props) {
  const { t, i18n } = useTranslation();
  const locale = i18n.language === "en" ? "en-US" : "vi-VN";
  const [exportingUrl, setExportingUrl] = useState<string | null>(null);
  const [exportError, setExportError] = useState<string | null>(null);
  const [exportInfo, setExportInfo] = useState<string | null>(null);

  const handleExport = async (e: React.MouseEvent, segment: RecordingSegment) => {
    e.stopPropagation();
    setExportError(null);
    setExportInfo(null);
    setExportingUrl(segment.playbackUrl);
    try {
      const info = await onExport(segment);
      if (info) setExportInfo(info);
    } catch (err) {
      setExportError(err instanceof Error ? err.message : "Xuất video thất bại");
    } finally {
      setExportingUrl(null);
    }
  };

  if (loading) {
    return (
      <div style={{ fontSize: 12, color: "var(--text-faint)", padding: "8px 0" }}>
        {t("cameraDetail.loadingRecordings")}
      </div>
    );
  }

  if (recordings.length === 0) {
    return <div className="empty-state">{t("cameraDetail.noRecordings")}</div>;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {exportError && (
        <p style={{ color: "var(--danger)", fontSize: 12, margin: "0 0 4px" }}>{exportError}</p>
      )}
      {exportInfo && (
        <p style={{ color: "var(--text-muted)", fontSize: 12, margin: "0 0 4px" }}>ℹ️ {exportInfo}</p>
      )}

      {recordings.map((segment) => {
        const isSelected = segment.playbackUrl === selectedUrl;
        const isExporting = segment.playbackUrl === exportingUrl;

        return (
          <div
            key={segment.playbackUrl}
            onClick={() => onSelect(segment)}
            className="card card-clickable"
            style={{
              padding: "8px 10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 8,
              border: isSelected ? "1px solid var(--primary)" : undefined,
              background: isSelected ? "var(--primary-bg)" : undefined,
            }}
          >
            <span style={{ fontSize: 12, display: "flex", alignItems: "center", gap: 6 }}>
              ▶ {formatStart(segment.start, locale)}
            </span>
            <span style={{ fontSize: 11, color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 8 }}>
              {formatDuration(segment.durationSeconds)}
              {canExport && (
                <button
                  className="btn btn-icon btn-ghost"
                  style={{ padding: 0, fontSize: 13, lineHeight: 1 }}
                  title={t("cameraDetail.exportRecording")}
                  disabled={exportingUrl !== null}
                  onClick={(e) => handleExport(e, segment)}
                >
                  {isExporting ? "…" : "⬇️"}
                </button>
              )}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default RecordingList;
