import type { ZoneWithCamera } from "../types/zoneWithCamera";

interface Props {
  zones: ZoneWithCamera[];

  selectedZone: number | null;

  onSelect: (zone: ZoneWithCamera) => void;
}

function ZoneList({
  zones,

  selectedZone,

  onSelect,
}: Props) {
  return (
    <div>
      <h3 className="panel-title" style={{ marginBottom: 8 }}>
        🏢 Zone
      </h3>

      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {zones.length === 0 && (
          <div className="empty-state">Chưa có khu vực nào</div>
        )}

        {zones.map((zone) => (
          <div
            key={zone.id}
            onClick={() => onSelect(zone)}
            className={
              "card card-clickable" +
              (selectedZone === zone.id ? " card-selected" : "")
            }
            style={{
              padding: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 8,
            }}
          >
            <div
              style={{
                display: "flex",

                alignItems: "center",

                gap: 8,
                minWidth: 0,
              }}
            >
              <div
                style={{
                  width: 12,

                  height: 12,

                  borderRadius: "50%",

                  background: zone.color,
                  flexShrink: 0,
                  boxShadow: "0 0 0 3px " + zone.color + "22",
                }}
              />

              <strong
                style={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  fontSize: 13,
                }}
              >
                {zone.name}
              </strong>
            </div>

            <small
              style={{ color: "var(--text-faint)", flexShrink: 0 }}
            >
              {zone.cameras.length} camera
            </small>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ZoneList;
