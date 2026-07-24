import { useCallback, useEffect, useState } from "react";
import {
  createAnprWatchArea,
  deleteAnprWatchArea,
  getAnprWatchAreas,
  setAnprWatchAreaEnabled,
} from "../api/client";
import type { AnprWatchArea, CreateAnprWatchAreaInput } from "../types/anpr";

export default function useAnprWatchAreas() {
  const [areas, setAreas] = useState<AnprWatchArea[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(() => {
    setLoading(true);
    return getAnprWatchAreas()
      .then(setAreas)
      .catch((err) => console.error("Không tải được vùng giám sát ANPR:", err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const create = useCallback(
    async (input: CreateAnprWatchAreaInput) => {
      await createAnprWatchArea(input);
      await refresh();
    },
    [refresh],
  );

  const setEnabled = useCallback(
    async (id: number, enabled: boolean) => {
      await setAnprWatchAreaEnabled(id, enabled);
      await refresh();
    },
    [refresh],
  );

  const remove = useCallback(
    async (id: number) => {
      await deleteAnprWatchArea(id);
      await refresh();
    },
    [refresh],
  );

  return { areas, loading, refresh, create, setEnabled, remove };
}
