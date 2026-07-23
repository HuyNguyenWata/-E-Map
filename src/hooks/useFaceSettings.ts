import { useCallback, useEffect, useState } from "react";
import { getFaceSettings, updateFaceSettings } from "../api/client";
import type { FaceSettings } from "../types/face";

export default function useFaceSettings() {
  const [settings, setSettings] = useState<FaceSettings | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(() => {
    setLoading(true);
    return getFaceSettings()
      .then(setSettings)
      .catch((err) => console.error("Không tải được cấu hình khuôn mặt:", err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const save = useCallback(async (antiSpoofingEnabled: boolean) => {
    const updated = await updateFaceSettings({ antiSpoofingEnabled });
    setSettings(updated);
    return updated;
  }, []);

  return { settings, loading, save };
}
