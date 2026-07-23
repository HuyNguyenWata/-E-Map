import { useCallback, useEffect, useState } from "react";
import { getBehaviorSettings, updateBehaviorSettings } from "../api/client";
import type { BehaviorSettings } from "../types/behavior";

export default function useBehaviorSettings() {
  const [settings, setSettings] = useState<BehaviorSettings | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(() => {
    setLoading(true);
    return getBehaviorSettings()
      .then(setSettings)
      .catch((err) => console.error("Không tải được cấu hình hành vi:", err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const save = useCallback(async (crowdThreshold: number) => {
    const updated = await updateBehaviorSettings({ crowdThreshold });
    setSettings(updated);
    return updated;
  }, []);

  return { settings, loading, save };
}
