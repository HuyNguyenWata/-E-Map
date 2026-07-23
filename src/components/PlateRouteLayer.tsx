import { CircleMarker, Polyline, Tooltip } from "react-leaflet";

export interface RoutePoint {
  lat: number;
  lng: number;
  detectedAt: string;
}

interface Props {
  points: RoutePoint[];
}

function PlateRouteLayer({ points }: Props) {
  if (points.length === 0) return null;

  const positions: [number, number][] = points.map((p) => [p.lat, p.lng]);

  return (
    <>
      <Polyline
        positions={positions}
        pathOptions={{ color: "#7c3aed", weight: 3, dashArray: "8 6" }}
      />

      {points.map((p, i) => {
        const isStart = i === 0;
        const isEnd = i === points.length - 1;

        return (
          <CircleMarker
            key={i}
            center={[p.lat, p.lng]}
            radius={isStart || isEnd ? 8 : 6}
            pathOptions={{
              color: "#7c3aed",
              weight: 2,
              fillColor: isStart ? "#22c55e" : isEnd ? "#ef4444" : "#7c3aed",
              fillOpacity: 1,
            }}
          >
            <Tooltip>
              {isStart ? "🟢 Điểm đầu · " : isEnd ? "🔴 Điểm cuối · " : ""}
              {p.detectedAt}
            </Tooltip>
          </CircleMarker>
        );
      })}
    </>
  );
}

export default PlateRouteLayer;
