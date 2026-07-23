import { useTranslation } from "react-i18next";
import type { SystemHealth } from "../types/systemHealth";

interface Props {
  health: SystemHealth | null;
}

function statusColor(percent: number) {
  if (percent >= 90) return { color: "var(--danger)", icon: "🔴" };
  if (percent >= 70) return { color: "var(--warning)", icon: "🟡" };
  return { color: "var(--success)", icon: "🟢" };
}

function HealthRow({ label, percent, valueText }: { label: string; percent: number; valueText: string }) {
  const { color, icon } = statusColor(percent);

  return (
    <div style={{ marginBottom: 10 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 12,
          marginBottom: 4,
        }}
      >
        <span style={{ color: "var(--text-muted)" }}>
          {icon} {label}
        </span>
        <span style={{ fontWeight: 600, color: "var(--text)" }}>{valueText}</span>
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
            width: `${Math.min(100, percent)}%`,
            height: "100%",
            borderRadius: 3,
            background: color,
            transition: "width 300ms ease",
          }}
        />
      </div>
    </div>
  );
}

function SystemHealthPanel({ health }: Props) {
  const { t } = useTranslation();

  if (!health) {
    return (
      <div style={{ fontSize: 12, color: "var(--text-faint)", padding: "8px 0" }}>
        {t("health.loading")}
      </div>
    );
  }

  const ramPercent = (health.ramUsedMb / health.ramTotalMb) * 100;
  const diskPercent = (health.diskUsedGb / health.diskTotalGb) * 100;

  return (
    <div>
      <div className="panel-title" style={{ marginBottom: 10 }}>
        {t("health.title")}
      </div>

      <HealthRow label="CPU" percent={health.cpuPercent} valueText={`${health.cpuPercent.toFixed(1)}%`} />
      <HealthRow
        label="RAM"
        percent={ramPercent}
        valueText={`${(health.ramUsedMb / 1024).toFixed(1)} / ${(health.ramTotalMb / 1024).toFixed(1)} GB`}
      />
      <HealthRow
        label={t("health.disk")}
        percent={diskPercent}
        valueText={`${health.diskUsedGb.toFixed(0)} / ${health.diskTotalGb.toFixed(0)} GB`}
      />
    </div>
  );
}

export default SystemHealthPanel;
