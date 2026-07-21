import { MapContainer, TileLayer } from "react-leaflet";

import CameraCluster from "./CameraCluster";
import HeatmapLayer from "./HeatmapLayer";
import MapController from "./MapController";
import MapClickHandler from "./MapClickHandler";
import ZoneCircle from "./ZoneCircle";
import ZoneLayer from "./ZoneLayer";
import type { Camera } from "../types/camera";
import type { CameraAlert } from "../types/alert";
import type { Zone } from "../types/zone";
import type { ZoneWithCamera } from "../types/zoneWithCamera";
import ZoneEditor from "./ZoneEditor";
interface Props {
  cameras: Camera[];
  alerts: CameraAlert[];
  onSelect: (camera: Camera) => void;
  showHeatmap: boolean;
  showCamera: boolean;
  onMapReady: (map: any) => void;
  zones: Zone[];
  selectedZone: number | null;

  onSelectZone: (zone: ZoneWithCamera) => void;
  drawZone: boolean;

  onCreateZone: (polygon: [number, number][]) => void;

  radiusMode: boolean;
  radiusCenter: [number, number] | null;
  radiusValue: number;
  onRadiusPick: (lat: number, lng: number) => void;
}

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
  radiusMode,
  radiusCenter,
  radiusValue,
  onRadiusPick,
}: Props) {
  return (
    <MapContainer
      center={[10.776889, 106.700806]}
      zoom={15}
      style={{
        width: "100%",
        height: "100%",
      }}
    >
      <MapController onReady={onMapReady} />

      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <ZoneEditor enabled={drawZone} onCreated={onCreateZone} />
      <ZoneLayer
        zones={zones}
        selectedZoneId={selectedZone}
        onSelect={onSelectZone}
      />

      {radiusMode && !drawZone && (
        <MapClickHandler
          onClick={(lat, lng) => onRadiusPick(lat, lng)}
        />
      )}

      {radiusCenter && (
        <ZoneCircle center={radiusCenter} radius={radiusValue} />
      )}

      {showHeatmap && <HeatmapLayer cameras={cameras} alerts={alerts} />}

      {showCamera && <CameraCluster cameras={cameras} onSelect={onSelect} />}
    </MapContainer>
  );
}

export default MapView;
