import { Polygon, Popup, Tooltip } from "react-leaflet";

import type { Zone } from "../types/zone";
import type { Camera } from "../types/camera";

interface ZoneWithCamera extends Zone {
  cameras: Camera[];
}

interface Props {
  zones: ZoneWithCamera[];
}

function ZoneLayer({ zones }: Props) {
  return (
    <>
      {zones.map((zone) => (
        <Polygon
          key={zone.id}
          positions={zone.polygon}
          pathOptions={{
            color: zone.color,
            weight: 2,
            fillColor: zone.color,
            fillOpacity: 0.25,
          }}
        >
          <Tooltip sticky>{zone.name}</Tooltip>

          <Popup>
            <div style={{ minWidth: 220 }}>
              <h3>{zone.name}</h3>

              <p>{zone.description}</p>

              <hr />

              <p>
                <strong>Camera:</strong> {zone.cameras.length}
              </p>

              <ul style={{ paddingLeft: 18 }}>
                {zone.cameras.map((camera) => (
                  <li key={camera.id}>{camera.name}</li>
                ))}
              </ul>
            </div>
          </Popup>
        </Polygon>
      ))}
    </>
  );
}

export default ZoneLayer;
