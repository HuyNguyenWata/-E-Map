import { useEffect, useState } from "react";
import { getCameraRecordings } from "../api/client";
import type { RecordingSegment } from "../types/recording";

export default function useCameraRecordings(cameraId: number | null) {
  const [recordings, setRecordings] = useState<RecordingSegment[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!cameraId) {
      setRecordings([]);
      return;
    }

    let cancelled = false;
    setLoading(true);

    getCameraRecordings(cameraId)
      .then((data) => {
        if (!cancelled) setRecordings(data);
      })
      .catch((err) => console.error("Không tải được danh sách bản ghi:", err))
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [cameraId]);

  return { recordings, loading };
}
