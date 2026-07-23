import { useEffect, useState } from "react";
import { getAlertStats } from "../api/client";
import type { AlertStats } from "../types/alertStats";

// refreshKey: truyền vào một giá trị đổi mỗi khi có alert mới (vd. alerts.length
// từ useCameraRealtime) để biểu đồ tự làm mới theo thời gian thực.
export default function useAlertStats(days = 7, refreshKey?: unknown) {
  const [stats, setStats] = useState<AlertStats | null>(null);

  useEffect(() => {
    let cancelled = false;

    getAlertStats(days)
      .then((data) => {
        if (!cancelled) setStats(data);
      })
      .catch((err) => console.error("Không tải được thống kê alert:", err));

    return () => {
      cancelled = true;
    };
  }, [days, refreshKey]);

  return { stats };
}
