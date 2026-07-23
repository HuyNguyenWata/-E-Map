import { useState } from "react";
import type { ZoneAlertStat } from "../types/zoneStats";

interface Props {
  stats: ZoneAlertStat[];
}

function ZoneStatsChart({ stats }: Props) {
  const [hovered, setHovered] = useState<number | null>(null);

  if (stats.length === 0) {
    return (
      <div style={{ fontSize: 12, color: "var(--text-faint)", padding: "8px 0" }}>
        Đang tải dữ liệu...
      </div>
    );
  }

  const maxTotal = Math.max(1, ...stats.map((z) => z.total));

  return (
    <div>
      <div className="panel-title" style={{ marginBottom: 10 }}>
        📍 Sự kiện theo khu vực (7 ngày)
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {stats.map((zone) => (
          <div
            key={zone.zoneId}
            onMouseEnter={() => setHovered(zone.zoneId)}
            onMouseLeave={() => setHovered(null)}
            style={{ cursor: "default" }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 12,
                marginBottom: 3,
              }}
            >
              <span style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--text-muted)" }}>
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 2,
                    background: zone.color,
                    display: "inline-block",
                  }}
                />
                {zone.zoneName}
              </span>
              <span style={{ fontWeight: 600, color: "var(--text)" }}>{zone.total}</span>
            </div>

            <div
              style={{
                height: 6,
                borderRadius: 3,
                background: "var(--border-soft)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${(zone.total / maxTotal) * 100}%`,
                  height: "100%",
                  borderRadius: 3,
                  background: zone.color,
                  minWidth: zone.total > 0 ? 3 : 0,
                  transition: "width 300ms ease",
                }}
              />
            </div>

            {hovered === zone.zoneId && zone.total > 0 && (
              <div style={{ fontSize: 11, color: "var(--text-faint)", marginTop: 3 }}>
                Info {zone.info} · Warning {zone.warning} · Critical {zone.critical}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ZoneStatsChart;
