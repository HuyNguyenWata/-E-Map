import { Polygon, Popup, Tooltip } from "react-leaflet";
import type { ZoneWithCamera } from "../types/zoneWithCamera";

interface Props {
  zones: ZoneWithCamera[];

  selectedZoneId: number | null;

  onSelect: (zone: ZoneWithCamera) => void;
}

function ZoneLayer({ zones, selectedZoneId, onSelect }: Props) {
  return (
    <>
      {zones.map((zone) => (
        <Polygon
          key={zone.id}
          positions={zone.polygon}
          pathOptions={{
            color: selectedZoneId === zone.id ? "#ef4444" : zone.color,

            weight: selectedZoneId === zone.id ? 5 : 2,

            fillColor: zone.color,

            fillOpacity: selectedZoneId === zone.id ? 0.45 : 0.25,
          }}
          eventHandlers={{
            click: () => onSelect(zone),
          }}
        >
          <Tooltip sticky>{zone.name}</Tooltip>

          <Popup>
            <div className="marker-popup" style={{ width: 220 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <div
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    background: zone.color,
                    flexShrink: 0,
                  }}
                />
                <h3 style={{ margin: 0 }}>{zone.name}</h3>
              </div>

              <p style={{ marginTop: 6 }}>{zone.description}</p>

              <hr />

              <p>
                <strong style={{ color: "var(--text)" }}>Camera:</strong>{" "}
                {zone?.cameras?.length}
              </p>

              <ul style={{ paddingLeft: 18, fontSize: 12, color: "var(--text-muted)" }}>
                {zone?.cameras?.map((camera) => (
                  <li key={camera.id}>{camera.name}</li>
                ))}
              </ul>

              <button
                className="btn btn-primary btn-sm btn-block"
                style={{ marginTop: 10 }}
                onClick={() => onSelect(zone)}
              >
                Chọn khu vực
              </button>
            </div>
          </Popup>
        </Polygon>
      ))}
    </>
  );
}

export default ZoneLayer;
