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
        position: "absolute",

        right: 20,

        top: 20,

        width: 350,

        height: "calc(100vh - 40px)",

        background: "#fff",

        zIndex: 2000,

        borderRadius: 12,

        padding: 20,

        overflow: "auto",

        boxShadow: "0 5px 20px rgba(0,0,0,.25)",
      }}
    >
      <button
        onClick={onClose}
        style={{
          float: "right",
        }}
      >
        Đóng
      </button>

      <h2>{camera.name}</h2>

      <p>
        Địa chỉ:
        <br />
        {camera.address}
      </p>

      <p>
        Trạng thái:
        <b
          style={{
            color: camera.status === "online" ? "green" : "red",
          }}
        >
          {" "}
          {camera.status}
        </b>
      </p>

      <hr />

      <h3>Live Camera</h3>

      <video width="100%" controls muted>
        <source src={camera.streamUrl} type="video/mp4" />
      </video>

      <hr />

      <h3>Lịch sử cảnh báo</h3>

      <hr />

      <h3>Lịch sử sự kiện</h3>

      <EventFilter value={filter} onChange={setFilter} />

      <EventTimeline events={events} onSelect={setCurrentEvent} />
    </div>
  );
}

export default CameraDetailPanel;
