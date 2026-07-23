import { useCallback, useEffect, useState } from "react";
import { createPlateEntry, deletePlateEntry, getPlateEntries } from "../api/client";
import type { CreatePlateEntryInput, LicensePlateEntry } from "../types/anpr";

export default function usePlateEntries() {
  const [entries, setEntries] = useState<LicensePlateEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(() => {
    setLoading(true);
    return getPlateEntries()
      .then(setEntries)
      .catch((err) => console.error("Không tải được danh sách đen/trắng:", err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addEntry = useCallback(async (input: CreatePlateEntryInput) => {
    const entry = await createPlateEntry(input);
    setEntries((prev) => [entry, ...prev]);
    return entry;
  }, []);

  const removeEntry = useCallback(async (id: number) => {
    await deletePlateEntry(id);
    setEntries((prev) => prev.filter((e) => e.id !== id));
  }, []);

  return { entries, loading, addEntry, removeEntry, refresh };
}
