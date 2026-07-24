import { useCallback, useEffect, useState } from "react";
import { deleteEventClip, getEventClips } from "../api/client";
import type { EventClip } from "../types/eventClip";

export default function useEventClips(cameraId: number | null) {
  const [clips, setClips] = useState<EventClip[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(() => {
    if (cameraId === null) {
      setClips([]);
      setLoading(false);
      return Promise.resolve();
    }

    setLoading(true);
    return getEventClips(cameraId)
      .then(setClips)
      .catch((err) => console.error("Không tải được event clip:", err))
      .finally(() => setLoading(false));
  }, [cameraId]);

  useEffect(() => {
    refresh();
    // Clip mới tạo ở trạng thái "pending" — làm mới định kỳ để tự chuyển
    // sang "ready" trên UI mà không cần người dùng bấm tải lại trang.
    const interval = setInterval(refresh, 15000);
    return () => clearInterval(interval);
  }, [refresh]);

  const remove = useCallback(async (id: number) => {
    await deleteEventClip(id);
    setClips((prev) => prev.filter((c) => c.id !== id));
  }, []);

  return { clips, loading, refresh, remove };
}
