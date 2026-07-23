import { useEffect, useMemo, useState } from "react";

import { getAlerts } from "../api/client";

import type { CameraAlert } from "../types/alert";

// refreshKey: truyền vào một giá trị đổi mỗi khi có alert mới (vd. alerts.length
// từ useCameraRealtime) để lịch sử tự làm mới theo thời gian thực.
export default function useCameraEvents(cameraId: number | null, refreshKey?: unknown) {
  const [filter, setFilter] = useState("all");
  const [allEvents, setAllEvents] = useState<CameraAlert[]>([]);

  useEffect(() => {
    if (!cameraId) {
      setAllEvents([]);
      return;
    }

    let cancelled = false;

    getAlerts(cameraId, 100)
      .then((data) => {
        if (!cancelled) setAllEvents(data);
      })
      .catch((err) => console.error("Không tải được lịch sử alert của camera:", err));

    return () => {
      cancelled = true;
    };
  }, [cameraId, refreshKey]);

  const events = useMemo(() => {
    if (filter === "all") return allEvents;

    return allEvents.filter((event) => event.type === filter);
  }, [allEvents, filter]);

  return {
    events,

    filter,

    setFilter,
  };
}
