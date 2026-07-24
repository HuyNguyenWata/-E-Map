import { useEffect, useRef, useState } from "react";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import { fromLonLat } from "ol/proj";

import { MapContext } from "../map/MapContext";
import CameraCluster from "./CameraCluster";
import HeatmapLayer from "./HeatmapLayer";
import MapController from "./MapController";
import MapClickHandler from "./MapClickHandler";
import ZoneCircle from "./ZoneCircle";
import ZoneLayer from "./ZoneLayer";
import PlateRouteLayer from "./PlateRouteLayer";
import type { RoutePoint } from "./PlateRouteLayer";
import type { Camera } from "../types/camera";
import type { CameraAlert } from "../types/alert";
import type { ZoneWithCamera } from "../types/zoneWithCamera";
import ZoneEditor from "./ZoneEditor";

interface Props {
  cameras: Camera[];
  alerts: CameraAlert[];
  onSelect: (camera: Camera) => void;
  showHeatmap: boolean;
  showCamera: boolean;
  onMapReady: (map: Map) => void;
  zones: ZoneWithCamera[];
  selectedZone: number | null;

  onSelectZone: (zone: ZoneWithCamera) => void;
  drawZone: boolean;

  onCreateZone: (polygon: [number, number][]) => void;

  drawAnprArea: boolean;
  onCreateAnprArea: (polygon: [number, number][]) => void;

  radiusMode: boolean;
  radiusCenter: [number, number] | null;
  radiusValue: number;
  onRadiusPick: (lat: number, lng: number) => void;

  routePoints: RoutePoint[];
}

const DEFAULT_CENTER: [number, number] = [106.700806, 10.776889]; // [lng, lat]
const DEFAULT_ZOOM = 15;

function MapView({
  cameras,
  alerts,
  onSelect,
  showHeatmap,
  showCamera,
  onMapReady,
  zones,
  selectedZone,
  onSelectZone,
  drawZone,
  onCreateZone,
  drawAnprArea,
  onCreateAnprArea,
  radiusMode,
  radiusCenter,
  radiusValue,
  onRadiusPick,
  routePoints,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<Map | null>(null);

  // Chỉ tạo Map 1 lần lúc mount — OpenLayers tự quản lý toàn bộ nội dung DOM
  // bên trong containerRef sau khi setTarget, nên div này KHÔNG được render
  // thêm JSX con nào cả (tránh xung đột React reconciliation với DOM do OL
  // tự chèn vào). Các layer/overlay component render dưới dạng anh em cùng
  // cấp, không lồng bên trong div này.
  useEffect(() => {
    if (!containerRef.current) return;

    const olMap = new Map({
      target: containerRef.current,
      layers: [new TileLayer({ source: new OSM() })],
      view: new View({
        center: fromLonLat(DEFAULT_CENTER),
        zoom: DEFAULT_ZOOM,
      }),
      controls: [],
    });

    setMap(olMap);

    return () => {
      olMap.setTarget(undefined);
      setMap(null);
    };
  }, []);

  return (
    <>
      <div ref={containerRef} style={{ width: "100%", height: "100%" }} />

      {map && (
        <MapContext.Provider value={map}>
          <MapController onReady={onMapReady} />
          <ZoneEditor enabled={drawZone} onCreated={onCreateZone} />
          <ZoneEditor enabled={drawAnprArea} onCreated={onCreateAnprArea} />
          <ZoneLayer zones={zones} selectedZoneId={selectedZone} onSelect={onSelectZone} />

          {radiusMode && !drawZone && !drawAnprArea && <MapClickHandler onClick={onRadiusPick} />}

          {radiusCenter && <ZoneCircle center={radiusCenter} radius={radiusValue} />}

          {routePoints.length > 0 && <PlateRouteLayer points={routePoints} />}

          {showHeatmap && <HeatmapLayer cameras={cameras} alerts={alerts} />}

          {showCamera && <CameraCluster cameras={cameras} onSelect={onSelect} />}
        </MapContext.Provider>
      )}
    </>
  );
}

export default MapView;
