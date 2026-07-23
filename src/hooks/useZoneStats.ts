import { useEffect, useState } from "react";
import { getZoneStats } from "../api/client";
import type { ZoneAlertStat } from "../types/zoneStats";

// refreshKey: truyền vào một giá trị đổi mỗi khi có alert mới (vd. alerts.length
// từ useCameraRealtime) để biểu đồ tự làm mới theo thời gian thực.
export default function useZoneStats(days = 7, refreshKey?: unknown) {
  const [stats, setStats] = useState<ZoneAlertStat[]>([]);

  useEffect(() => {
    let cancelled = false;

    getZoneStats(days)
      .then((data) => {
        if (!cancelled) setStats(data);
      })
      .catch((err) => console.error("Không tải được thống kê theo khu vực:", err));

    return () => {
      cancelled = true;
    };
  }, [days, refreshKey]);

  return { stats };
}
