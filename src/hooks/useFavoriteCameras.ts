import { useCallback, useEffect, useState } from "react";
import { addFavoriteCamera, getFavoriteCameras, removeFavoriteCamera } from "../api/client";

export default function useFavoriteCameras() {
  const [favoriteIds, setFavoriteIds] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(() => {
    setLoading(true);
    return getFavoriteCameras()
      .then((cameras) => setFavoriteIds(new Set(cameras.map((c) => c.id))))
      .catch((err) => console.error("Không tải được camera yêu thích:", err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const toggleFavorite = useCallback(
    async (cameraId: number) => {
      const isFavorite = favoriteIds.has(cameraId);

      // Cập nhật lạc quan trước, revert nếu API lỗi — bấm sao phải phản hồi
      // ngay, không đợi round-trip.
      setFavoriteIds((prev) => {
        const next = new Set(prev);
        if (isFavorite) next.delete(cameraId);
        else next.add(cameraId);
        return next;
      });

      try {
        if (isFavorite) await removeFavoriteCamera(cameraId);
        else await addFavoriteCamera(cameraId);
      } catch (err) {
        console.error("Không đổi được trạng thái yêu thích:", err);
        await refresh();
      }
    },
    [favoriteIds, refresh],
  );

  return { favoriteIds, loading, toggleFavorite };
}
