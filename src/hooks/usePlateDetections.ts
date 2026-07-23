import { useCallback, useEffect, useState } from "react";
import { getPlateDetections } from "../api/client";
import type { PlateDetection } from "../types/anpr";

// plateNumber: nếu truyền vào, chỉ lấy lịch sử của đúng biển số đó (dùng cho
// truy vết lộ trình di chuyển). Không truyền -> lấy feed detection gần nhất.
export default function usePlateDetections(plateNumber?: string, take = 50) {
  const [detections, setDetections] = useState<PlateDetection[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(() => {
    setLoading(true);
    return getPlateDetections(plateNumber, take)
      .then(setDetections)
      .catch((err) => console.error("Không tải được danh sách detection:", err))
      .finally(() => setLoading(false));
  }, [plateNumber, take]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { detections, loading, refresh };
}
