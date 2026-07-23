import { useCallback } from "react";
import { FeatureGroup } from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import L from "leaflet";

interface Props {
  enabled: boolean;
  onCreated: (polygon: [number, number][]) => void;
}

function ZoneEditor({ enabled, onCreated }: Props) {
  const handleCreated = useCallback(
    (event: L.DrawEvents.Created) => {
      const layer = event.layer as L.Polygon;

      const latLngs = layer.getLatLngs()[0] as L.LatLng[];

      const polygon = latLngs.map((point) => [point.lat, point.lng]) as [
        number,
        number,
      ][];

      onCreated(polygon);
    },
    [onCreated],
  );

  if (!enabled) {
    return null;
  }

  return (
    <FeatureGroup>
      <EditControl
        position="topleft"
        draw={{
          rectangle: false,
          circle: false,
          circlemarker: false,
          marker: false,
          polyline: false,
          polygon: true,
        }}
        edit={{
          edit: false,
          remove: false,
        }}
        onCreated={handleCreated}
      />
    </FeatureGroup>
  );
}

export default ZoneEditor;
