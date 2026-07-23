import { useCallback, useEffect, useState } from "react";
import { getFaceDetections } from "../api/client";
import type { FaceDetection } from "../types/face";

// personId: nếu truyền vào, chỉ lấy lịch sử điểm danh của đúng người đó.
export default function useFaceDetections(personId?: number, take = 50) {
  const [detections, setDetections] = useState<FaceDetection[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(() => {
    setLoading(true);
    return getFaceDetections(personId, take)
      .then(setDetections)
      .catch((err) => console.error("Không tải được lịch sử điểm danh:", err))
      .finally(() => setLoading(false));
  }, [personId, take]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { detections, loading, refresh };
}
