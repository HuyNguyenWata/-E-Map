import { useCallback, useEffect, useState } from "react";
import { createFavoriteView, deleteFavoriteView, getFavoriteViews } from "../api/client";
import type { FavoriteView } from "../types/favorite";

export default function useFavoriteViews() {
  const [views, setViews] = useState<FavoriteView[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(() => {
    setLoading(true);
    return getFavoriteViews()
      .then(setViews)
      .catch((err) => console.error("Không tải được layout đã lưu:", err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const save = useCallback(
    async (name: string, cameraIds: number[]) => {
      const view = await createFavoriteView({ name, cameraIds });
      setViews((prev) => [view, ...prev]);
      return view;
    },
    [],
  );

  const remove = useCallback(async (id: number) => {
    await deleteFavoriteView(id);
    setViews((prev) => prev.filter((v) => v.id !== id));
  }, []);

  return { views, loading, save, remove };
}
