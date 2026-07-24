import { useEffect, useRef, useState } from "react";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import Feature from "ol/Feature";
import { Polygon } from "ol/geom";
import { Fill, Stroke, Style } from "ol/style";
import { fromLonLat } from "ol/proj";
import type { FeatureLike } from "ol/Feature";
import type MapBrowserEvent from "ol/MapBrowserEvent";
import { useOlMap } from "../map/MapContext";
import OverlayPopup from "../map/OverlayPopup";
import type { ZoneWithCamera } from "../types/zoneWithCamera";

interface Props {
  zones: ZoneWithCamera[];
  selectedZoneId: number | null;
  onSelect: (zone: ZoneWithCamera) => void;
}

const ZONE_KEY = "zone";

function zoneStyle(zone: ZoneWithCamera, selected: boolean) {
  return new Style({
    stroke: new Stroke({ color: selected ? "#ef4444" : zone.color, width: selected ? 5 : 2 }),
    fill: new Fill({ color: hexToRgba(zone.color, selected ? 0.45 : 0.25) }),
  });
}

function hexToRgba(hex: string, alpha: number): string {
  const clean = hex.replace("#", "");
  const r = parseInt(clean.substring(0, 2), 16) || 0;
  const g = parseInt(clean.substring(2, 4), 16) || 0;
  const b = parseInt(clean.substring(4, 6), 16) || 0;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function centroid(polygon: [number, number][]): [number, number] {
  const lat = polygon.reduce((sum, p) => sum + p[0], 0) / polygon.length;
  const lng = polygon.reduce((sum, p) => sum + p[1], 0) / polygon.length;
  return [lat, lng];
}

function ZoneLayer({ zones, selectedZoneId, onSelect }: Props) {
  const map = useOlMap();
  const layerRef = useRef<VectorLayer | null>(null);
  const [openZoneId, setOpenZoneId] = useState<number | null>(null);
  const [hoveredZoneId, setHoveredZoneId] = useState<number | null>(null);

  useEffect(() => {
    const features = zones.map((zone) => {
      const feature = new Feature(
        new Polygon([zone.polygon.map(([lat, lng]) => fromLonLat([lng, lat]))]),
      );
      feature.set(ZONE_KEY, zone);
      feature.setStyle(zoneStyle(zone, zone.id === selectedZoneId));
      return feature;
    });

    const layer = new VectorLayer({ source: new VectorSource({ features }) });
    layerRef.current = layer;
    map.addLayer(layer);

    return () => {
      map.removeLayer(layer);
      layerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, zones, selectedZoneId]);

  useEffect(() => {
    const findZone = (evt: MapBrowserEvent) => {
      const layer = layerRef.current;
      if (!layer) return null;
      const feature = map.forEachFeatureAtPixel(
        evt.pixel,
        (f: FeatureLike) => f,
        { layerFilter: (l) => l === layer },
      );
      return (feature?.get(ZONE_KEY) as ZoneWithCamera | undefined) ?? null;
    };

    const handleClick = (evt: MapBrowserEvent) => {
      const zone = findZone(evt);
      setOpenZoneId(zone?.id ?? null);
      if (zone) onSelect(zone);
    };

    const handleMove = (evt: MapBrowserEvent) => {
      const zone = findZone(evt);
      setHoveredZoneId(zone?.id ?? null);
    };

    map.on("click", handleClick);
    map.on("pointermove", handleMove);
    return () => {
      map.un("click", handleClick);
      map.un("pointermove", handleMove);
    };
  }, [map, onSelect]);

  const openZone = zones.find((z) => z.id === openZoneId) ?? null;
  const hoveredZone = !openZone ? zones.find((z) => z.id === hoveredZoneId) ?? null : null;

  return (
    <>
      {hoveredZone && (
        <OverlayPopup
          lat={centroid(hoveredZone.polygon)[0]}
          lng={centroid(hoveredZone.polygon)[1]}
          className="ol-tooltip"
        >
          <div className="ol-tooltip-content">{hoveredZone.name}</div>
        </OverlayPopup>
      )}

      {openZone && (
        <OverlayPopup
          lat={centroid(openZone.polygon)[0]}
          lng={centroid(openZone.polygon)[1]}
          className="ol-popup"
        >
          <div className="ol-popup-content">
            <div className="marker-popup" style={{ width: 220 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    background: openZone.color,
                    flexShrink: 0,
                  }}
                />
                <h3 style={{ margin: 0 }}>{openZone.name}</h3>
              </div>

              <p style={{ marginTop: 6 }}>{openZone.description}</p>

              <hr />

              <p>
                <strong style={{ color: "var(--text)" }}>Camera:</strong> {openZone?.cameras?.length}
              </p>

              <ul style={{ paddingLeft: 18, fontSize: 12, color: "var(--text-muted)" }}>
                {openZone?.cameras?.map((camera) => (
                  <li key={camera.id}>{camera.name}</li>
                ))}
              </ul>

              <button
                className="btn btn-primary btn-sm btn-block"
                style={{ marginTop: 10 }}
                onClick={() => onSelect(openZone)}
              >
                Chọn khu vực
              </button>
            </div>
          </div>
        </OverlayPopup>
      )}
    </>
  );
}

export default ZoneLayer;
