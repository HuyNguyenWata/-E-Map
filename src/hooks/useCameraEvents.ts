import { useMemo, useState } from "react";

import { mockEvents } from "../data/events";

import type { CameraAlert } from "../types/alert";

export default function useCameraEvents(cameraId: number | null) {
  const [filter, setFilter] = useState("all");

  const events = useMemo(() => {
    if (!cameraId) return [];

    return mockEvents.filter(
      (event) =>
        event.cameraId === cameraId &&
        (filter === "all" || event.type === filter),
    );
  }, [cameraId, filter]);

  return {
    events,

    filter,

    setFilter,
  };
}
