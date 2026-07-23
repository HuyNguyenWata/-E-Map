import { useCallback, useEffect, useState } from "react";
import { getBehaviorDetections } from "../api/client";
import type { BehaviorDetection, BehaviorType } from "../types/behavior";

export default function useBehaviorDetections(type?: BehaviorType, take = 50) {
  const [detections, setDetections] = useState<BehaviorDetection[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(() => {
    setLoading(true);
    return getBehaviorDetections(type, take)
      .then(setDetections)
      .catch((err) => console.error("Không tải được lịch sử phát hiện hành vi:", err))
      .finally(() => setLoading(false));
  }, [type, take]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { detections, loading, refresh };
}
