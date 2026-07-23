import { useCallback, useEffect, useState } from "react";
import { createBookmark, deleteBookmark, getBookmarks } from "../api/client";
import type { VideoBookmark } from "../types/bookmark";

export default function useBookmarks(cameraId: number | null) {
  const [bookmarks, setBookmarks] = useState<VideoBookmark[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(() => {
    if (cameraId === null) {
      setBookmarks([]);
      setLoading(false);
      return Promise.resolve();
    }

    setLoading(true);
    return getBookmarks(cameraId)
      .then(setBookmarks)
      .catch((err) => console.error("Không tải được bookmark:", err))
      .finally(() => setLoading(false));
  }, [cameraId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const add = useCallback(
    async (label: string, timestamp: string) => {
      if (cameraId === null) return;
      const bookmark = await createBookmark({ cameraId, label, timestamp });
      setBookmarks((prev) => [bookmark, ...prev]);
    },
    [cameraId],
  );

  const remove = useCallback(async (id: number) => {
    await deleteBookmark(id);
    setBookmarks((prev) => prev.filter((b) => b.id !== id));
  }, []);

  return { bookmarks, loading, add, remove };
}
