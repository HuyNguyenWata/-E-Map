import type { RecordingSegment } from "../types/recording";

interface Props {
  recordings: RecordingSegment[];
  loading: boolean;
  selectedUrl: string | null;
  onSelect: (segment: RecordingSegment) => void;
}

function formatStart(iso: string) {
  const date = new Date(iso);
  return date.toLocaleString("vi-VN", {
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

function RecordingList({ recordings, loading, selectedUrl, onSelect }: Props) {
  if (loading) {
    return (
      <div style={{ fontSize: 12, color: "var(--text-faint)", padding: "8px 0" }}>
        Đang tải danh sách bản ghi...
      </div>
    );
  }

  if (recordings.length === 0) {
    return <div className="empty-state">Chưa có bản ghi nào cho camera này</div>;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {recordings.map((segment) => {
        const isSelected = segment.playbackUrl === selectedUrl;

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
              ▶ {formatStart(segment.start)}
            </span>
            <span style={{ fontSize: 11, color: "var(--text-muted)" }}>
              {formatDuration(segment.durationSeconds)}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default RecordingList;
