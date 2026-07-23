import { useState } from "react";
import type { AlertStats, DailyAlertStat } from "../types/alertStats";

interface Props {
  stats: AlertStats | null;
}

const SEGMENTS: { key: keyof Pick<DailyAlertStat, "info" | "warning" | "critical">; label: string; color: string }[] = [
  { key: "info", label: "Info", color: "var(--primary)" },
  { key: "warning", label: "Warning", color: "var(--warning)" },
  { key: "critical", label: "Critical", color: "var(--danger)" },
];

function formatDayLabel(isoDate: string) {
  const [, month, day] = isoDate.split("-");
  return `${day}/${month}`;
}

function EventTrendChart({ stats }: Props) {
  const [hovered, setHovered] = useState<{ day: DailyAlertStat; x: number } | null>(null);

  if (!stats) {
    return (
      <div style={{ fontSize: 12, color: "var(--text-faint)", padding: "8px 0" }}>
        Đang tải dữ liệu...
      </div>
    );
  }

  const maxTotal = Math.max(1, ...stats.daily.map((d) => d.total));
  const trend = stats.trendPercent;
  // Nhiều sự kiện hơn là xấu, nên tăng = màu cảnh báo, giảm = màu tốt (ngược với quy ước tăng=xanh thông thường).
  const trendColor = trend === null ? "var(--text-muted)" : trend > 0 ? "var(--danger)" : trend < 0 ? "var(--success)" : "var(--text-muted)";
  const trendArrow = trend === null ? "" : trend > 0 ? "▲" : trend < 0 ? "▼" : "–";

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          marginBottom: 10,
        }}
      >
        <span className="panel-title" style={{ margin: 0 }}>
          📈 Xu hướng sự kiện (7 ngày)
        </span>

        {trend !== null && (
          <span style={{ fontSize: 12, fontWeight: 600, color: trendColor }}>
            {trendArrow} {Math.abs(trend)}%
          </span>
        )}
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          gap: 6,
          height: 90,
          position: "relative",
          borderBottom: "1px solid var(--border)",
          paddingBottom: 2,
        }}
      >
        {stats.daily.map((day, index) => (
          <div
            key={day.date}
            onMouseEnter={() => setHovered({ day, x: index })}
            onMouseLeave={() => setHovered(null)}
            style={{
              flex: 1,
              height: "100%",
              display: "flex",
              flexDirection: "column-reverse",
              gap: 2,
              cursor: "default",
              opacity: hovered && hovered.x !== index ? 0.55 : 1,
              transition: "opacity 120ms ease",
            }}
          >
            {SEGMENTS.map(({ key, color }) => {
              const value = day[key];
              if (value === 0) return null;

              const heightPercent = (value / maxTotal) * 100;
              return (
                <div
                  key={key}
                  style={{
                    width: "100%",
                    height: `${heightPercent}%`,
                    minHeight: value > 0 ? 3 : 0,
                    background: color,
                    borderRadius: 2,
                  }}
                />
              );
            })}
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
        {stats.daily.map((day) => (
          <div
            key={day.date}
            style={{
              flex: 1,
              textAlign: "center",
              fontSize: 10,
              color: "var(--text-faint)",
            }}
          >
            {formatDayLabel(day.date)}
          </div>
        ))}
      </div>

      {hovered && (
        <div
          style={{
            marginTop: 8,
            padding: "6px 10px",
            background: "var(--panel-bg-soft)",
            border: "1px solid var(--border-soft)",
            borderRadius: "var(--radius-sm)",
            fontSize: 12,
          }}
        >
          <b>{formatDayLabel(hovered.day.date)}</b> · Tổng {hovered.day.total} sự kiện — Info {hovered.day.info}, Warning {hovered.day.warning}, Critical {hovered.day.critical}
        </div>
      )}

      <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
        {SEGMENTS.map(({ key, label, color }) => (
          <div key={key} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "var(--text-muted)" }}>
            <span style={{ width: 8, height: 8, borderRadius: 2, background: color, display: "inline-block" }} />
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}

export default EventTrendChart;
