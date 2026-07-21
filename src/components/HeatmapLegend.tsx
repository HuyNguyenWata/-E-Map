function HeatmapLegend() {
  return (
    <div className="panel-block" style={{ padding: 10, width: 200 }}>
      <div
        style={{
          fontSize: 12,
          fontWeight: 600,
          color: "var(--text-muted)",
          marginBottom: 6,
        }}
      >
        🔥 Mật độ sự kiện
      </div>

      <div
        style={{
          height: 8,
          borderRadius: 999,
          background:
            "linear-gradient(to right, #3b82f6, #22d3ee, #a3e635, #facc15, #ef4444)",
        }}
      />

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 11,
          color: "var(--text-faint)",
          marginTop: 4,
        }}
      >
        <span>Thấp</span>
        <span>Cao</span>
      </div>
    </div>
  );
}

export default HeatmapLegend;
