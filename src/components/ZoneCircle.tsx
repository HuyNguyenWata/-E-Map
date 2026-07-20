import { Circle } from "react-leaflet";

interface Props {
  center: [number, number];

  radius: number;
}

function ZoneCircle({ center, radius }: Props) {
  return (
    <Circle
      center={center}
      radius={radius}
      pathOptions={{
        color: "red",
        fillColor: "red",
        fillOpacity: 0.15,
      }}
    />
  );
}

export default ZoneCircle;
