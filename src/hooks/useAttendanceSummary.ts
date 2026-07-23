import { useCallback, useEffect, useState } from "react";
import { getAttendanceSummary } from "../api/client";
import type { AttendanceSummary } from "../types/face";

export default function useAttendanceSummary(days = 7, refreshKey?: unknown) {
  const [summary, setSummary] = useState<AttendanceSummary[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(() => {
    setLoading(true);
    return getAttendanceSummary(days)
      .then(setSummary)
      .catch((err) => console.error("Không tải được báo cáo điểm danh:", err))
      .finally(() => setLoading(false));
  }, [days]);

  useEffect(() => {
    refresh();
  }, [refresh, refreshKey]);

  return { summary, loading, refresh };
}
