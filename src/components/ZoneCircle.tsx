import { Circle, CircleMarker } from "react-leaflet";

interface Props {
  center: [number, number];

  radius: number;
}

function ZoneCircle({ center, radius }: Props) {
  return (
    <>
      <Circle
        center={center}
        radius={radius}
        pathOptions={{
          color: "#f97316",
          weight: 2,
          dashArray: "6 6",
          fillColor: "#f97316",
          fillOpacity: 0.12,
        }}
      />

      <CircleMarker
        center={center}
        radius={6}
        pathOptions={{
          color: "#f97316",
          weight: 2,
          fillColor: "#f97316",
          fillOpacity: 1,
        }}
      />
    </>
  );
}

export default ZoneCircle;
