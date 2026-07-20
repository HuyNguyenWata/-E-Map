import type { Camera } from "../types/camera";
import type { CameraAlert } from "../types/alert";
import EventTimeline from "./EventTimeline";

import EventFilter from "./EventFilter";

import useCameraEvents from "../hooks/useCameraEvents";
import { useState } from "react";
interface Props {
  camera: Camera | null;

  alerts: CameraAlert[];

  onClose: () => void;
}

function CameraDetailPanel({
  camera,

  alerts,

  onClose,
}: Props) {
  if (!camera) {
    return null;
  }

  const { events, filter, setFilter } = useCameraEvents(camera?.id ?? null);
  const [currentEvent, setCurrentEvent] = useState(null);
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

        <button className="btn btn-icon btn-ghost" onClick={onClose} title="Đóng">
          ✕
        </button>
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

      <hr />

      <h3>Live Camera</h3>

      <video
        width="100%"
        controls
        muted
        style={{
          marginTop: 8,
          borderRadius: "var(--radius-md)",
          background: "#000",
        }}
      >
        <source src={camera.streamUrl} type="video/mp4" />
      </video>

      <hr />

      <h3>Lịch sử cảnh báo</h3>
      <p
        style={{
          fontSize: 12,
          color: "var(--text-faint)",
          marginTop: 6,
        }}
      >
        Chưa có dữ liệu
      </p>

      <hr />

      <h3 style={{ marginBottom: 10 }}>Lịch sử sự kiện</h3>

      <EventFilter value={filter} onChange={setFilter} />

      <EventTimeline events={events} onSelect={setCurrentEvent} />
    </div>
  );
}

export default CameraDetailPanel;
