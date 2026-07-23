import { useEffect, useState } from "react";
import type { Camera } from "../types/camera";
import type { CameraAlert } from "../types/alert";
import type { RecordingSegment } from "../types/recording";
import EventTimeline from "./EventTimeline";

import EventFilter from "./EventFilter";

import useCameraEvents from "../hooks/useCameraEvents";
import useCameraRecordings from "../hooks/useCameraRecordings";
import HlsVideo from "./HlsVideo";
import RecordingList from "./RecordingList";
import { useAuth } from "../auth/AuthContext";
interface Props {
  camera: Camera | null;

  alerts: CameraAlert[];

  onClose: () => void;

  onEdit: (camera: Camera) => void;

  onDelete: (camera: Camera) => void;
}

function CameraDetailPanel({
  camera,

  alerts,

  onClose,

  onEdit,

  onDelete,
}: Props) {
  const { user } = useAuth();
  const [selectedRecording, setSelectedRecording] = useState<RecordingSegment | null>(null);
  const { recordings, loading: recordingsLoading } = useCameraRecordings(camera?.id ?? null);

  // Đổi camera thì bỏ chọn bản ghi cũ, quay về xem trực tiếp.
  useEffect(() => {
    setSelectedRecording(null);
  }, [camera?.id]);

  const { events, filter, setFilter } = useCameraEvents(camera?.id ?? null, alerts.length);

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
          <h2 style={{ marginBottom: 6 }}>{camera.name}</h2>
          <span
            className={
              "badge " +
              (camera.status === "online" ? "badge-online" : "badge-offline")
            }
          >
            <span className="badge-dot" />
            {camera.status === "online" ? "Online" : "Offline"}
          </span>
        </div>

        <div style={{ display: "flex", gap: 6 }}>
          {user?.role === "admin" && (
            <>
              <button className="btn btn-sm" onClick={() => onEdit(camera)}>
                ✏️ Sửa
              </button>
              <button className="btn btn-sm btn-danger" onClick={() => onDelete(camera)}>
                🗑️ Xoá
              </button>
            </>
          )}
          <button className="btn btn-icon btn-ghost" onClick={onClose} title="Đóng">
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
          Signal: <b style={{ color: "var(--text)" }}>{camera.signal}%</b>
        </span>
        <span>Last seen: {camera.lastSeen}</span>
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
          {selectedRecording ? "📼 Đang xem lại" : "🔴 Live Camera"}
        </h3>

        {selectedRecording && (
          <button className="btn btn-sm" onClick={() => setSelectedRecording(null)}>
            Về trực tiếp
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

      <h3 style={{ marginBottom: 10 }}>🎞️ Ghi hình</h3>

      <RecordingList
        recordings={recordings}
        loading={recordingsLoading}
        selectedUrl={selectedRecording?.playbackUrl ?? null}
        onSelect={setSelectedRecording}
      />

      <hr />

      <h3 style={{ marginBottom: 10 }}>Lịch sử cảnh báo</h3>

      <EventFilter value={filter} onChange={setFilter} />

      <EventTimeline events={events} />
    </div>
  );
}

export default CameraDetailPanel;
